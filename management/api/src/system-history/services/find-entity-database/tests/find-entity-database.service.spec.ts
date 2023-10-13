import { Test, TestingModule } from '@nestjs/testing';
import { FindEntityDatabaseService } from '../find-entity-database.service';
import { Resources, RoleEnum } from '@/common';
import { handleModuleDependencies, mockPrismaService } from '@/utils';

describe('FindEntityDatabaseService', () => {
  let service: FindEntityDatabaseService;

  const mockId = 'mock.id';
  const mockName = 'mock.name';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindEntityDatabaseService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<FindEntityDatabaseService>(FindEntityDatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call findUnique from instructor when resource is INSTRUCTOR', async () => {
    mockPrismaService.instructor.findUnique.mockResolvedValue({
      id: mockId,
    });

    await service.run(mockId, Resources.INSTRUCTOR);

    expect(mockPrismaService.instructor.findUnique).toHaveBeenCalledWith({
      where: { id: mockId },
    });
  });

  it('should invoke prismaService and call findUnique from student when resource is STUDENT', async () => {
    mockPrismaService.student.findUnique.mockResolvedValue({
      id: mockId,
    });

    await service.run(mockId, Resources.STUDENT);

    expect(mockPrismaService.student.findUnique).toHaveBeenCalledWith({
      where: { id: mockId },
    });
  });

  it('should invoke prismaService and call findUnique from class when resource is CLASS', async () => {
    mockPrismaService.class.findUnique.mockResolvedValue({
      id: mockId,
      instructor: { name: mockName },
      student: { name: mockName },
      category: { acronym: mockName },
    });

    await service.run(mockId, Resources.CLASS);

    expect(mockPrismaService.class.findUnique).toHaveBeenCalledWith({
      where: { id: mockId },
      include: {
        category: true,
        instructor: true,
        student: true,
      },
    });
  });
});
