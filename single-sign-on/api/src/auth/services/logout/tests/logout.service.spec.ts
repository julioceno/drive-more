import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { LogoutService } from '../logout.service';

describe('LogoutService', () => {
  let service: LogoutService;

  const userId = 'mock.id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogoutService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<LogoutService>(LogoutService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call prismaService and invoke deleteMany from refreshToken', async () => {
    await service.run(userId);

    expect(mockPrismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
      where: { userId },
    });
  });
});
