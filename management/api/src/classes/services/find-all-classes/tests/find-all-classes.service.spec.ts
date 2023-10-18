import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { FindAllClassesService } from '../find-all-classes.service';
import { FindAllClassesDto } from '../dto/find-all-classes.dto';
import { FindListEntity } from '@/common/entities';
import { ClassEntity } from '@/classes/entities/class.entity';

describe('FindAllClassesService', () => {
  let service: FindAllClassesService;

  const dto: FindAllClassesDto = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllClassesService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.class.findMany.mockResolvedValue([{ id: 'mock.id' }]);

    service = module.get<FindAllClassesService>(FindAllClassesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return list instance of FindListEntity and item list instance of ClassEntity', async () => {
    const response = await service.run(dto);

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(FindListEntity);

    response.list.map((item) => {
      expect(item).toBeInstanceOf(ClassEntity);
    });
  });

  it('should invoke prismaService and call class.findMany and class.count', async () => {
    await service.run(dto);

    const where = {};

    expect(mockPrismaService.class.findMany).toHaveBeenLastCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
      where,
    });

    expect(mockPrismaService.class.count).toHaveBeenLastCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
      where,
    });
  });
});
