import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateClassService } from '../create-class.service';
import { CreateClassDto } from '../dto/create-class.dto';
import { addDays, addHours, subDays } from 'date-fns';
import { Class } from '@prisma/client';
import { ClassEntity } from '@/classes/entities/class.entity';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';
import { BadRequestException } from '@nestjs/common';

describe('CreateClassService', () => {
  let service: CreateClassService;

  const creatorEmail = 'mock.creatorEmail';

  const classId = 'mock.classId';
  const instructorId = 'mock.instructorId';
  const categoryId = 'mock.categoryId';
  const studentId = 'mock.studentId';

  const startAt = addHours(new Date(), 1).toISOString();
  const endAt = addHours(new Date(), 2).toISOString();

  const dto: CreateClassDto = {
    categoryId,
    startAt,
    endAt,
    instructorId,
    studentId,
  };

  const classResult = {
    id: classId,
    ...dto,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateClassService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.class.findMany.mockResolvedValue([]);
    mockPrismaService.class.create.mockResolvedValue(classResult);

    service = module.get<CreateClassService>(CreateClassService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call class.create', async () => {
    await service.run(creatorEmail, dto);

    expect(mockPrismaService.class.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should create class and return in instance ClassEntity', async () => {
    const result = await service.run(creatorEmail, dto);
    expect(result).toBeInstanceOf(ClassEntity);
  });

  it('should invoke systemHistoryProxyService and call createRecordStandard', async () => {
    await service.run(creatorEmail, dto);

    expect(
      mockSystemHistoryProxyService.createRecordStandard,
    ).toHaveBeenCalledWith(
      creatorEmail,
      ActionEnum.CREATE,
      classResult,
      Resources.CLASS,
    );
  });

  it('should throw error when startAt is before current date', async () => {
    let error = null;

    const newDto: CreateClassDto = {
      ...dto,
      startAt: subDays(new Date(), 8).toISOString(),
    };

    try {
      await service.run(creatorEmail, newDto);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.message).toBe(
      'A data de início deve ser uma data futura a atual.',
    );
  });

  it('should throw error when endAt is after startAt', async () => {
    let error = null;

    const newDto: CreateClassDto = {
      ...dto,
      startAt: addDays(new Date(), 8).toISOString(),
    };

    try {
      await service.run(creatorEmail, newDto);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.message).toBe(
      'Data de término deve ser posterior à data início.',
    );
  });

  it('should invoke prismaService and call class.findMany', async () => {
    await service.run(creatorEmail, dto);

    const timeIntervalFilter = [
      {
        startAt: {
          gte: startAt,
          lte: endAt,
        },
      },
      {
        endAt: {
          gte: startAt,
          lte: endAt,
        },
      },
    ];

    expect(mockPrismaService.class.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            OR: timeIntervalFilter,
            instructorId: 'mock.instructorId',
          },
          {
            OR: timeIntervalFilter,
            studentId: 'mock.studentId',
          },
          {
            OR: timeIntervalFilter,
            instructorId: 'mock.instructorId',
            studentId: 'mock.studentId',
          },
        ],
      },
    });
  });

  it('should throw error when has class in time interval', async () => {
    let error = null;

    mockPrismaService.class.findMany.mockResolvedValue([{ id: classId }]);

    try {
      await service.run(creatorEmail, dto);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.message).toBe(
      'Já existe uma aula nesse intervalo de tempo para o instrutor ou para o aluno.',
    );
  });
});
