import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecordService } from '../create-record.service';
import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Action } from '@prisma/client';
import { CreateRecordDto } from '../dto/create-record.dto';
import { RecordEntity } from '@/records/entities/record.entity';

describe('CreateRecordService', () => {
  let service: CreateRecordService;

  const id = 'mock.id';
  const code = 1;
  const creatorEmail = 'mock.creatorEmail';
  const payload = 'mock.payload';

  const moduleName = 'mock.moduleName';
  const resourceName = 'mock.resourceName';

  const dto: CreateRecordDto = {
    creatorEmail,
    action: Action.CREATE,
    entityId: id,
    moduleName,
    resourceName,
    payload,
  };

  function createMockModule(method: 'create' | 'findUnique') {
    mockPrismaService.module[method].mockResolvedValue({
      id,
      code,
      name: moduleName,
    });
  }

  function createMockResource(method: 'create' | 'findFirst') {
    mockPrismaService.resource[method].mockResolvedValue({
      id,
      code,
      name: moduleName,
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateRecordService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<CreateRecordService>(CreateRecordService);

    createMockModule('create');

    mockPrismaService.resource.create.mockResolvedValue({
      id,
      code,
      name: resourceName,
      moduleId: id,
    });

    mockPrismaService.record.create.mockResolvedValue({
      id,
      code,
      creatorEmail,
      action: Action.CREATE,
      entityId: id,
      payload,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService for create module, resource and record', async () => {
    await service.run(dto);

    expect(mockPrismaService.module.create).toHaveBeenLastCalledWith({
      data: {
        name: moduleName,
      },
    });
    expect(mockPrismaService.resource.create).toHaveBeenLastCalledWith({
      data: {
        name: resourceName,
        moduleId: id,
      },
    });
    expect(mockPrismaService.record.create).toHaveBeenLastCalledWith({
      data: {
        creatorEmail,
        action: Action.CREATE,
        entityId: id,
        payload,
        resourceId: id,
      },
    });
  });

  it('should invoke prismaService.module and call findUnique when module exists', async () => {
    createMockModule('findUnique');

    await service.run(dto);

    expect(mockPrismaService.module.findUnique).toHaveBeenLastCalledWith({
      where: {
        name: moduleName,
      },
    });

    expect(mockPrismaService.module.create).not.toHaveBeenCalled();
  });

  it('should invoke prismaService.resource and call findFirst when resource exists', async () => {
    createMockResource('findFirst');

    await service.run(dto);

    expect(mockPrismaService.resource.findFirst).toHaveBeenLastCalledWith({
      where: {
        moduleId: id,
        name: resourceName,
      },
    });

    expect(mockPrismaService.resource.create).not.toHaveBeenCalled();
  });

  it('should create record and return in instance RecordEntity', async () => {
    const response = await service.run(dto);

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(RecordEntity);
  });
});
