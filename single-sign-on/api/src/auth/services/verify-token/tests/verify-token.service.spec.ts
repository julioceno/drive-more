import { handleModuleDependencies } from '@/utils';
import { mockConfigService } from '@/utils/mocks/services/config';
import { Test, TestingModule } from '@nestjs/testing';
import { VerifyTokenService } from '../verify-token.service';
import { VerifyTokenDto } from '../dto/verify-token.dto';
import { mockJwtService } from '@/utils/mocks/services/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { RoleEnum } from '@/common';

describe('VerifyTokenService', () => {
  let service: VerifyTokenService;

  const token = 'mock.token';
  const clientId = 'mock.client';
  const secret = 'mock.secret';

  const dto: VerifyTokenDto = { token, clientId };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerifyTokenService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<VerifyTokenService>(VerifyTokenService);

    mockConfigService.get.mockReturnValue(secret);
    mockJwtService.verifyAsync.mockResolvedValue({
      id: 'fdbe66f2-f31d-4302-bb97-0ff888045292',
      role: RoleEnum.ADMIN,
      iat: 1690727566,
      exp: 1690728466,
      clientId,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke jwtService and invoke verifyAsync method', async () => {
    await service.run(dto);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token, { secret });
  });

  it('should invoke configService and invoke get method', async () => {
    await service.run(dto);
    expect(mockConfigService.get).toHaveBeenLastCalledWith('authToken.secret');
  });

  it('should return response ok with payload', async () => {
    const response = await service.run(dto);

    expect(response).toBeDefined();
    expect(response).toStrictEqual({
      exp: 1690728466,
      iat: 1690727566,
      id: 'fdbe66f2-f31d-4302-bb97-0ff888045292',
      role: RoleEnum.ADMIN,
      clientId,
    });
  });

  it('should throw UnauthorizedException when token is not valid', async () => {
    mockJwtService.verifyAsync.mockRejectedValue({ message: 'token expired' });

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

  it('should throw UnauthorizedException when clientId is not valid', async () => {
    let error = null;

    try {
      await service.run({ ...dto, clientId: 'client id not valid' });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(UnauthorizedException);
    expect(error.message).toBe('Unauthorized');
  });
});
