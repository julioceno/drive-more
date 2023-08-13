import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { handleModuleDependencies } from '@/utils';
import { SignInDto } from '@/auth/services/sign-in/dto/sign-in.dto';
import {
  mockLogoutService,
  mockRefreshTokenService,
  mockSignInService,
  mockVerifyTokenService,
} from '@/utils/mocks/services/auth';
import { RefreshTokenDto } from '@/auth/services/refresh-token/dto/refresh-token.dto';
import { AuthService } from '@/auth/services/auth.service';
import { VerifyTokenDto } from '@/auth/services/verify-token/dto/verify-token.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const userId = 'mock.id';
  const clientId = 'mock.clientId';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should invoke signIn method from AuthController', async () => {
    const dto: SignInDto = {
      email: 'mock.email',
      password: 'mock.password',
      clientId,
    };

    await controller.signIn(dto);
    expect(mockSignInService.run).toHaveBeenLastCalledWith({
      email: 'mock.email',
      password: 'mock.password',
      clientId,
    });
  });

  it('should invoke refreshToken method from AuthController', async () => {
    const refreshTokenId = 'mock.refreshTokenId';

    const dto: RefreshTokenDto = {
      refreshTokenId,
      clientId,
    };

    await controller.refreshToken(dto);

    expect(mockRefreshTokenService.run).toHaveBeenLastCalledWith({
      refreshTokenId,
      clientId,
    });
  });

  it('should invoke logout method from AuthController', async () => {
    await controller.logout(userId);
    expect(mockLogoutService.run).toHaveBeenLastCalledWith(userId);
  });

  it('should invoke verifyToken method from AuthController', async () => {
    const dto: VerifyTokenDto = { token: 'mock.token', clientId };

    await controller.verifyToken(dto);
    expect(mockVerifyTokenService.run).toHaveBeenLastCalledWith(dto);
  });
});
