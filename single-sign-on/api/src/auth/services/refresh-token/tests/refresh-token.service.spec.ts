import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenService } from '../refresh-token.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { UnauthorizedException } from '@nestjs/common';
import {
  mockGenerateTokenService,
  mockGenerateRefreshTokenService,
} from '@/utils/mocks/services/auth';
import { addMinutes, getUnixTime } from 'date-fns';
import { RoleEnum } from '@/common';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;

  function mockerRefreshTokenValue(expiresIn: number) {
    return mockPrismaService.refreshToken.findUnique.mockResolvedValue({
      id: 'mock.id',
      expiresIn,
      user: {
        id: 'mock.id',
        role: {
          name: RoleEnum.USER,
        },
      },
    });
  }

  const dto: RefreshTokenDto = {
    refreshTokenId: 'a4cfd5e4-e13f-436f-bd0e-cab92055829d',
    clientId: 'mock.clientId',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefreshTokenService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);

    mockerRefreshTokenValue(getUnixTime(addMinutes(new Date(), 100)));

    mockGenerateTokenService.run.mockResolvedValue('mock.accessToken');
    mockGenerateRefreshTokenService.run.mockResolvedValue('mock.refreshToken');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call prismaService and invoke findUnique from refreshToken', async () => {
    await service.run(dto);

    expect(mockPrismaService.refreshToken.findUnique).toHaveBeenLastCalledWith({
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
      where: {
        id: 'a4cfd5e4-e13f-436f-bd0e-cab92055829d',
      },
    });
  });

  it('should throw UnauthorizedException when refreshToken not exists', async () => {
    mockPrismaService.refreshToken.findUnique.mockResolvedValue(null);

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

  it('should call generateTokenService and invoke run method and return accessToken only', async () => {
    const response = await service.run(dto);
    expect(response).toStrictEqual({ accessToken: 'mock.accessToken' });
  });

  it('should call generateRefreshTokenService and invoke run method when refresh token is expired and return accessToken and refreshToken', async () => {
    mockerRefreshTokenValue(1);

    const response = await service.run(dto);

    expect(response).toStrictEqual({
      accessToken: 'mock.accessToken',
      refreshToken: 'mock.refreshToken',
    });
  });
});
