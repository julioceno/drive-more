import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { FindOneClassService } from '../find-one-class.service';
import { ClassEntity } from '@/classes/entities/class.entity';
import { NotFoundException } from '@nestjs/common';

describe('FindOneClassService', () => {
  let service: FindOneClassService;

  const id = 'mock.id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindOneClassService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.class.findUnique.mockResolvedValue({
      id,
    });

    service = module.get<FindOneClassService>(FindOneClassService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call class.findUnique', async () => {
    await service.run(id);

    expect(mockPrismaService.class.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should throw NotFoundExcpetion when class not exists', async () => {
    mockPrismaService.class.findUnique.mockResolvedValue(null);

    let error = null;
    try {
      await service.run(id);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.message).toBe('Recurso buscado impossível de ser encontrado.');
  });

  it('should return entity in instance of ClassEntity', async () => {
    const response = await service.run(id);

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(ClassEntity);
  });
});
