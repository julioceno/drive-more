import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { FindListEntity } from '@/common/entities';
import { FindAllStudentsService } from '../find-all-students.service';
import { FindAllStudentsDto } from '../dto/find-all-students.dto';
import { StudentEntity } from '@/students/entities/student.entity';

describe('FindAllStudentsService', () => {
  let service: FindAllStudentsService;

  const dto: FindAllStudentsDto = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllStudentsService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.student.findMany.mockResolvedValue([{ id: 'mock.id' }]);

    service = module.get<FindAllStudentsService>(FindAllStudentsService);
  });

  afterEach(() => jest.clearAllMocks());

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return list intance of FindListEntity and items list instance of StudentEntity', async () => {
    const response = await service.run(dto);

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(FindListEntity);

    response.list.map((item) => {
      expect(item).toBeInstanceOf(StudentEntity);
    });
  });

  it('should invoke prismaService and call student.findMany and student.count', async () => {
    await service.run(dto);

    const select = {
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        cpf: {
          contains: undefined,
          mode: 'insensitive',
        },
        name: {
          contains: undefined,
          mode: 'insensitive',
        },
      },
    };

    expect(mockPrismaService.student.findMany).toHaveBeenLastCalledWith(select);
    expect(mockPrismaService.student.count).toHaveBeenLastCalledWith(select);
  });
});
