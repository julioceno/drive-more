import { Test, TestingModule } from '@nestjs/testing';
import { FindEntityDatabaseService } from '../find-entity-database.service';
import { Resources, RoleEnum } from '@/common';
import { handleModuleDependencies, mockPrismaService } from '@/utils';

describe('FindEntityDatabaseService', () => {
  let service: FindEntityDatabaseService;

  const mockId = 'mock.id';

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

  it('should invoke prismaService and call findUnique from user when resource is USER', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: mockId,
      role: RoleEnum.ADMIN,
    });

    await service.run(mockId, Resources.USER);

    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: mockId },
      include: {
        role: true,
      },
    });
  });
});
