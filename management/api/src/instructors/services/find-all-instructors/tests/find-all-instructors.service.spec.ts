import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { FindAllInstructorsDto } from '../dto/find-all-instructors.dto';
import { FindAllInstructorsService } from '../find-all-instructors.service';
import { FindListEntity } from '@/common/entities';
import { InstructorEntity } from '@/instructors/entities/instructor.entity';

describe('FindAllInstructorsService', () => {
  let service: FindAllInstructorsService;

  const dto: FindAllInstructorsDto = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllInstructorsService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.instructor.findMany.mockResolvedValue([
      { id: 'mock.id' },
    ]);

    service = module.get<FindAllInstructorsService>(FindAllInstructorsService);
  });

  afterEach(() => jest.clearAllMocks());

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return list intance of FindListEntity and items list instance of InstructorEntity', async () => {
    const response = await service.run(dto);

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(FindListEntity);

    response.list.map((item) => {
      expect(item).toBeInstanceOf(InstructorEntity);
    });
  });

  it('should invoke prismaService and call instructor.findMany and instructor.count', async () => {
    await service.run(dto);

    const where = {
      cpf: {
        contains: undefined,
        mode: 'insensitive',
      },
      name: {
        contains: undefined,
        mode: 'insensitive',
      },
    };

    expect(mockPrismaService.instructor.findMany).toHaveBeenLastCalledWith({
      where,
    });
    expect(mockPrismaService.instructor.count).toHaveBeenLastCalledWith({
      where,
    });
  });
});
