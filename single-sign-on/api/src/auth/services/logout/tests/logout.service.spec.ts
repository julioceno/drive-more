import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { LogoutService } from '../logout.service';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';

describe('LogoutService', () => {
  let service: LogoutService;

  const userId = 'mock.id';
  const email = 'mock.email';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogoutService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<LogoutService>(LogoutService);

    mockPrismaService.user.findUnique.mockResolvedValue({
      id: userId,
      codigo: 1,
      email,
    });
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

  it('should invoke SystemHistoryProxyService and call createRecordCustom method', async () => {
    await service.run(userId);

    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });

    expect(
      mockSystemHistoryProxyService.createRecordCustom,
    ).toHaveBeenLastCalledWith({
      action: ActionEnum.OTHER,
      creatorEmail: email,
      entityId: 1,
      payload: 'User mock.email is deauthenticated',
      resourceName: Resources.AUTH,
    });
  });
});
