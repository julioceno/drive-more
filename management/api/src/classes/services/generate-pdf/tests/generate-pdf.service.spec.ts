import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { GeneratePdfService } from '../generate-pdf.service';
import { GeneratePdfDto } from '../dto/generate-pdf.dto';
import { Request } from 'express';

jest.mock('node:worker_threads', () => ({
  Worker: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    postMessage: jest.fn(),
  })),
}));

describe('GeneratePdfService', () => {
  let service: GeneratePdfService;

  const classId = 'mock.classId';
  const studentId = 'mock.studentId';
  const creatorEmail = 'mock.creatorEmail';

  const dto: GeneratePdfDto = {
    studentId,
    timeZone: 'America/Sao_Paulo',
  };

  const request = {
    get: () => jest.fn().mockReturnValue('mock.url'),
  } as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratePdfService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.class.findMany.mockResolvedValue([
      {
        id: classId,
        instructor: {
          name: 'mock.instructorName',
        },
        category: {
          acronym: 'mock.acronym',
        },
        startAt: new Date(),
        endAt: new Date(),
      },
    ]);

    mockPrismaService.student.findUnique.mockResolvedValue({ id: studentId });

    service = module.get<GeneratePdfService>(GeneratePdfService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call worker thread and return url file', async () => {
    await service.run(creatorEmail, dto, request);

    expect(require('node:worker_threads').Worker).toHaveBeenCalledWith(
      expect.stringContaining('build-pdf'),
    );
  });

  it('Should invoke prismaService and call class.findMany', async () => {});

  it('Should invoke prismaService and call student.findUnique', async () => {});

  it('Should throw NotFoundException when classes not exists', async () => {});

  it('Should throw NotFoundException when student not exists', async () => {});

  it('Should invoke systemHistoryProxyService and call createRecordCustom', async () => {});
});
