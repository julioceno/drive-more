import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { handleModuleDependencies } from '@/utils';
import { SignInDto } from '@/auth/services/sign-in/dto/sign-in.dto';
import {
  mockLogoutService,
  mockRefreshTokenService,
  mockSignInService,
} from '@/utils/mocks/services/auth';
import { RefreshTokenDto } from '@/auth/services/refresh-token/dto/refresh-token.dto';
import { AuthService } from '@/auth/services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const userId = 'mock.id';

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
      email: 'email.mock',
      password: 'password.mock',
      clientId: 'clientId.mock',
    };

    await controller.signIn(dto);
    expect(mockSignInService.run).toHaveBeenLastCalledWith({
      clientId: 'clientId.mock',
      email: 'email.mock',
      password: 'password.mock',
    });
  });

  it('should invoke refreshToken method from AuthController', async () => {
    const refreshTokenId = 'mock.refreshTokenId';

    const dto: RefreshTokenDto = {
      refreshTokenId,
    };

    await controller.refreshToken(dto);

    expect(mockRefreshTokenService.run).toHaveBeenLastCalledWith({
      refreshTokenId,
    });
  });

  it('should invoke logout method from AuthController', async () => {
    await controller.logout(userId);
    expect(mockLogoutService.run).toHaveBeenLastCalledWith(userId);
  });
});
