import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { FindAllDiffsRecordsService } from '../find-all-diffs-records.service';
import {
  mockReturnMockFirst,
  mockReturnMockSecond,
  mockReturnMockThird,
} from './mocks';
import { FindListEntity } from '@/common/entities';
import { RecordDiffEntity } from '@/records/entities/record-diff.entity';
import { NotFoundException } from '@nestjs/common';

describe('FindAllDiffsRecordsService', () => {
  let service: FindAllDiffsRecordsService;

  function createMock(array: unknown[]) {
    mockPrismaService.record.findMany.mockResolvedValue(array);
    mockPrismaService.record.count.mockResolvedValue(array.length);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllDiffsRecordsService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<FindAllDiffsRecordsService>(
      FindAllDiffsRecordsService,
    );

    mockPrismaService.resource.findUnique.mockResolvedValue({
      name: 'USER',
      Module: {
        name: 'SINGLE SIGN ON',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService.record.findmany and prismaservice.record.count', async () => {
    createMock([]);

    await service.run({});

    expect(mockPrismaService.record.count).toHaveBeenCalledWith({
      where: {
        code: undefined,
        entityId: undefined,
      },
    });
    expect(mockPrismaService.record.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
      skip: undefined,
      take: undefined,
      where: {
        code: undefined,
        entityId: undefined,
      },
    });
  });

  it('should find all diffs', async () => {
    createMock(mockReturnMockFirst);

    const response = await service.run({});

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(FindListEntity);

    const { list, totalCount } = response;

    expect(totalCount).toBe(5);

    list.forEach((record) => {
      expect(record).toBeInstanceOf(RecordDiffEntity);
    });
  });

  it('should create diffs correctaly', async () => {
    createMock(mockReturnMockSecond);

    mockPrismaService.record.findFirst.mockResolvedValue(
      mockReturnMockSecond[mockReturnMockSecond.length - 1],
    );

    const response = await service.run({});

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(FindListEntity);

    const { list } = response;

    const firstDiffs = list[list.length - 1].diffs;
    const lastDiffs = list[0].diffs;

    lastDiffs.forEach((item) => {
      const { field, oldValue, newValue } = item;

      const creationValue = firstDiffs.find(
        ({ field: fieldCreationRecord }) => field === fieldCreationRecord,
      ).newValue;

      // Validate if value in creation record is equal a old value in new record
      expect(oldValue).toBe(creationValue);

      // Validate if values is differents in return
      expect(oldValue).not.toBe(newValue);
    });
  });

  it('should not create diffs when payload is not an object', async () => {
    createMock(mockReturnMockThird);

    const response = await service.run({});

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(FindListEntity);

    const { list } = response;

    const firstDiffs = list[list.length - 1].diffs;
    const lastDiffs = list[0].diffs;

    expect(typeof firstDiffs === 'object').toBeTruthy();
    expect(typeof lastDiffs === 'string').toBeTruthy();
  });

  it('Should return update record without old values when old record not exists', async () => {
    createMock([mockReturnMockSecond[0]]);
    const response = await service.run({});

    expect(response).toBeDefined();
  });

  it('should throw NotFoundException when not found resource', async () => {
    mockPrismaService.resource.findUnique.mockResolvedValue(null);
    createMock(mockReturnMockSecond);

    let error = null;
    try {
      await service.run({});
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.message).toBe(
      'Recurso "Resource" impossível de ser encontrado.',
    );
  });
});
