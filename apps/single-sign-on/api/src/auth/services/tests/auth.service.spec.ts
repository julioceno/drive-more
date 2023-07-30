import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { handleModuleDependencies } from '@/utils';
import { SignInDto } from '../sign-in/dto/sign-in.dto';
import {
  mockLogoutService,
  mockRefreshTokenService,
  mockSignInService,
  mockVerifyTokenService,
} from '@/utils/mocks/services/auth';
import { RefreshTokenDto } from '../refresh-token/dto/refresh-token.dto';
import { VerifyTokenDto } from '../verify-token/dto/verify-token.dto';

describe('AuthService', () => {
  let service: AuthService;

  const userId = 'mock.id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke signIn method', async () => {
    const dto: SignInDto = {
      email: 'email.mock',
      password: 'password.mock',
      clientId: 'clientId.mock',
    };

    await service.signIn(dto);
    expect(mockSignInService.run).toHaveBeenLastCalledWith({
      clientId: 'clientId.mock',
      email: 'email.mock',
      password: 'password.mock',
    });
  });

  it('should invoke refreshToken method', async () => {
    const refreshTokenId = 'mock.refreshTokenId';

    const dto: RefreshTokenDto = {
      refreshTokenId,
    };

    await service.refreshToken(dto);

    expect(mockRefreshTokenService.run).toHaveBeenLastCalledWith({
      refreshTokenId,
    });
  });

  it('should invoke logout method', async () => {
    await service.logout(userId);
    expect(mockLogoutService.run).toHaveBeenLastCalledWith(userId);
  });

  it('should invoke verifyToken method', async () => {
    const dto: VerifyTokenDto = { token: 'mock.token' };

    await service.verifyToken(dto);
    expect(mockVerifyTokenService.run).toHaveBeenLastCalledWith(dto);
  });
});
