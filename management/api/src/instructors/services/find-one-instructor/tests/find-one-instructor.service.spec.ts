import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { FindOneInstructorService } from '../find-one-instructor.service';

describe('FindOneInstructorService', () => {
  let service: FindOneInstructorService;

  const id = 'mock.id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindOneInstructorService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.instructor.findUnique.mockResolvedValue({
      id: 'mock.id',
    });

    service = module.get<FindOneInstructorService>(FindOneInstructorService);
  });

  afterEach(() => jest.clearAllMocks());

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call instructor.findUnique', async () => {
    await service.run(id);

    expect(mockPrismaService.instructor.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should throw NotFoundExcpetion when instructor not exists', async () => {
    mockPrismaService.instructor.findUnique.mockResolvedValue(null);

    let error = null;
    try {
      await service.run(id);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.message).toBe('Recurso buscado impossível de ser encontrado.');
  });
});
