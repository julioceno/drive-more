import { Resources, RoleEnum } from '@/common';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import {
  mockGenerateRefreshTokenService,
  mockGenerateTokenService,
} from '@/utils/mocks/services/auth';
import { mockConfigService } from '@/utils/mocks/services/config';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignInDto } from '../dto/sign-in.dto';
import { SignInService } from '../sign-in.service';

describe('SignInService', () => {
  let service: SignInService;

  const userId = 'mock.id';
  const email = 'mock@drive.more.com';
  const name = 'mock.name';
  const ssoClientId = 'e8ef6516-66b3-4fad-8ec6-dfd53d75a34c';

  const userPassword =
    '$2b$08$ZqYGiCxwNBKUVlcJ.vD0vuqMW9cNgrWDW.339ExcyBRia570uVHLe'; // pass is "user"

  const dto: SignInDto = {
    email: 'mock@drive.more.com',
    password: 'user',
    clientId: ssoClientId,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignInService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<SignInService>(SignInService);

    mockConfigService.get.mockReturnValue(ssoClientId);

    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'mock.id',
      email,
      name,
      password: userPassword,
      code: 1,
      role: {
        name: RoleEnum.USER,
      },
    });

    mockGenerateTokenService.run.mockResolvedValue('mock.accessToken');
    mockGenerateRefreshTokenService.run.mockResolvedValue('mock.refreshToken');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call prismaService and invoke findUnique from user', async () => {
    await service.run(dto);

    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      include: {
        role: true,
      },
      where: {
        email: 'mock@drive.more.com',
      },
    });
  });

  it('should throw UnauthorizedException when user not exists', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    let error = null;

    try {
      await service.run(dto);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(UnauthorizedException);
    expect(error.message).toBe('Unauthorized');
  });

  it('should throw UnauthorizedException when password is not correctaly', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    let error = null;

    try {
      await service.run({ ...dto, password: 'incorrect password' });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(UnauthorizedException);
    expect(error.message).toBe('Unauthorized');
  });

  it('should UnauthorizedException when user not can authenticate in this system', async () => {
    let error = null;

    try {
      await service.run({ ...dto, clientId: 'mock.clientId' });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(UnauthorizedException);
    expect(error.message).toBe('User not authorized to access this system.');
  });

  it('should call generateTokenService and invoke run method', async () => {
    await service.run(dto);

    expect(mockGenerateTokenService.run).toHaveBeenCalledWith({
      id: userId,
      name,
      email,
      role: RoleEnum.USER,
      clientId: ssoClientId,
    });
  });
  it('should call refreshTokenService and invoke run method', async () => {
    await service.run(dto);

    expect(mockGenerateRefreshTokenService.run).toHaveBeenCalledWith(userId);
  });

  it('should return accessToken and refreshToken', async () => {
    const response = await service.run(dto);

    expect(response).toStrictEqual({
      accessToken: 'mock.accessToken',
      refreshToken: 'mock.refreshToken',
    });
  });

  it('should invoke SystemHistoryProxyService and call createRecordCustom method', async () => {
    await service.run(dto);

    expect(
      mockSystemHistoryProxyService.createRecordCustom,
    ).toHaveBeenLastCalledWith({
      action: ActionEnum.OTHER,
      creatorEmail: email,
      entityId: 1,
      payload: 'User mock@drive.more.com is authenticate',
      resourceName: Resources.AUTH,
    });
  });
});
