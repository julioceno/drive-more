import { handleModuleDependencies } from '@/utils';
import { mockConfigService } from '@/utils/mocks/services/config';
import { Test, TestingModule } from '@nestjs/testing';
import { VerifyTokenService } from '../verify-token.service';
import { VerifyTokenDto } from '../dto/verify-token.dto';
import { mockJwtService } from '@/utils/mocks/services/jwt';
import { RoleEnum } from '@/common';

describe('VerifyTokenService', () => {
  let service: VerifyTokenService;

  const token = 'mock.token';
  const secret = 'mock.secret';

  const dto: VerifyTokenDto = { token };

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

  it('should return response ok true with payload', async () => {
    const response = await service.run(dto);

    expect(response).toBeDefined();
    expect(response).toStrictEqual({
      ok: true,
      payload: {
        exp: 1690728466,
        iat: 1690727566,
        id: 'fdbe66f2-f31d-4302-bb97-0ff888045292',
        role: RoleEnum.ADMIN,
      },
    });
  });

  it('should return response ok false with message', async () => {
    mockJwtService.verifyAsync.mockRejectedValue({ message: 'token expired' });

    const response = await service.run(dto);

    expect(response).toBeDefined();
    expect(response).toStrictEqual({
      ok: false,
      message: 'token expired',
    });
  });
});
