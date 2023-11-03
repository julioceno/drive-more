import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { GeneratePdfDto } from '../dto/generate-pdf.dto';
import { GeneratePdfService } from '../generate-pdf.service';
import { NotFoundException } from '@nestjs/common';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';
import { join } from 'path';

jest.mock('node:worker_threads', () => {
  return {
    Worker: jest.fn().mockImplementation(() => ({
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'message') {
          callback('url.pdf');
        }
      }),
      postMessage: jest.fn(),
    })),
  };
});

describe('GeneratePdfService', () => {
  let service: GeneratePdfService;

  const classId = 'mock.classId';
  const studentId = 'mock.studentId';
  const studentCode = 1;
  const studentName = 'mock.name';
  const creatorEmail = 'mock.creatorEmail';
  const timeZone = 'America/Sao_Paulo';

  const dto: GeneratePdfDto = {
    studentId,
    timeZone,
  };

  const request = {
    protocol: 'localhost',
    get: () => 3032,
  } as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratePdfService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<GeneratePdfService>(GeneratePdfService);

    mockPrismaService.class.findMany.mockResolvedValue([
      {
        id: classId,
        instructor: {
          name: 'mock.instructorName',
        },
        category: {
          acronym: 'mock.acronym',
        },
        startAt: new Date('2023-10-30T02:34:32.953Z'),
        endAt: new Date('2023-10-30T02:34:32.953Z'),
      },
    ]);

    mockPrismaService.student.findUnique.mockResolvedValue({
      id: studentId,
      code: studentCode,
      name: studentName,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should instantiate worker class with path correctally', async () => {
    await service.run(creatorEmail, dto, request);

    expect(require('node:worker_threads').Worker).toHaveBeenCalledTimes(1);
    expect(require('node:worker_threads').Worker).toHaveBeenCalledWith(
      join(__dirname, '..', 'build-pdf'),
    );
  });

  it('should call postmessage correctally', async () => {
    jest.mock('node:worker_threads');

    const { Worker } = require('node:worker_threads');

    const postMessageSpy = jest.fn();

    Worker.mockImplementation(() => ({
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'message') {
          callback('url.pdf');
        }
      }),
      postMessage: postMessageSpy,
    }));

    await service.run(creatorEmail, dto, request);

    expect(postMessageSpy).toHaveBeenCalledWith({
      classes: [
        {
          category: 'mock.acronym',
          endAt: '29/10/2023 - 23:34',
          instructorName: 'mock.instructorName',
          startAt: '29/10/2023 - 23:34',
        },
      ],
      studentName,
      timeZone,
      url: 'localhost://3032',
    });
  });

  it('should call worker thread and return url file', async () => {
    const url = await service.run(creatorEmail, dto, request);

    expect(url).toStrictEqual({ url: 'url.pdf' });
  });

  it('Should invoke prismaService and call student.findUnique', async () => {
    await service.run(creatorEmail, dto, request);

    expect(mockPrismaService.student.findUnique).toHaveBeenLastCalledWith({
      where: { id: studentId },
    });
  });

  it('Should throw NotFoundException when student not exists', async () => {
    mockPrismaService.student.findUnique.mockResolvedValue(null);

    let error = null;

    try {
      await service.run(creatorEmail, dto, request);
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.message).toBe('Aluno não encontrado.');
  });

  it('Should invoke prismaService and call class.findMany', async () => {
    await service.run(creatorEmail, dto, request);

    expect(mockPrismaService.class.findMany).toHaveBeenLastCalledWith({
      include: {
        category: true,
        instructor: true,
      },
      where: {
        startAt: {
          gt: expect.any(Date),
        },
        studentId,
      },
    });
  });

  it('Should throw NotFoundException when classes not exists', async () => {
    mockPrismaService.class.findMany.mockResolvedValue([]);

    let error = null;

    try {
      await service.run(creatorEmail, dto, request);
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.message).toBe(
      'Não existe nenhuma aula pendente para esse aluno.',
    );
  });

  it('Should invoke systemHistoryProxyService and call createRecordCustom', async () => {
    await service.run(creatorEmail, dto, request);

    expect(
      mockSystemHistoryProxyService.createRecordCustom,
    ).toHaveBeenCalledWith({
      action: ActionEnum.OTHER,
      creatorEmail,
      entityId: studentCode,
      payload: 'Gerando documento com as aulas do aluno.',
      resourceName: Resources.STUDENT,
    });
  });
});
