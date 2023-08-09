import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { SignInService } from '../sign-in.service';
import { SignInDto } from '../dto/sign-in.dto';
import { mockConfigService } from '@/utils/mocks/services/config';
import { UnauthorizedException } from '@nestjs/common';
import {
  mockGenerateTokenService,
  mockGenerateRefreshTokenService,
} from '@/utils/mocks/services/auth';
import { RoleEnum } from 'dirigir-more-utils';

describe('SignInService', () => {
  let service: SignInService;

  const userId = 'mock.id';
  const ssoClientId = 'e8ef6516-66b3-4fad-8ec6-dfd53d75a34c';

  const userPassword =
    '$2b$08$ZqYGiCxwNBKUVlcJ.vD0vuqMW9cNgrWDW.339ExcyBRia570uVHLe'; // pass is "user"

  const dto: SignInDto = {
    email: 'mock@dirigir.more.com',
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
      password: userPassword,
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
        email: 'mock@dirigir.more.com',
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
});
