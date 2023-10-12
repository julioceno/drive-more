import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { FindOneStudentService } from '../find-one-student.service';
import { StudentEntity } from '@/students/entities/student.entity';

describe('FindOneStudentService', () => {
  let service: FindOneStudentService;

  const id = 'mock.id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindOneStudentService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.student.findUnique.mockResolvedValue({
      id: 'mock.id',
    });

    service = module.get<FindOneStudentService>(FindOneStudentService);
  });

  afterEach(() => jest.clearAllMocks());

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call student.findUnique', async () => {
    await service.run(id);

    expect(mockPrismaService.student.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should throw NotFoundExcpetion when student not exists', async () => {
    mockPrismaService.student.findUnique.mockResolvedValue(null);

    let error = null;
    try {
      await service.run(id);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.message).toBe('Recurso buscado impossível de ser encontrado.');
  });

  it('should return entity in instance of StudentEntity', async () => {
    const response = await service.run(id);

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(StudentEntity);
  });
});
