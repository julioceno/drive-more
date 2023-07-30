import { GenerateRefreshTokenService } from '@/auth/services/generate-refresh-token/generate-refresh-token.service';
import { GenerateTokenService } from '@/auth/services/generate-token/generate-token.service';
import { IServiceMock } from './servicesMocks';
import { SignInService } from '@/auth/services/sign-in/sign-in.service';
import { RefreshTokenService } from '@/auth/services/refresh-token/refresh-token.service';
import { LogoutService } from '@/auth/services/logout/logout.service';
import { VerifyTokenService } from '@/auth/services/verify-token/verify-token.service';

export const mockGenerateTokenService = {
  run: jest.fn(),
};

export const mockGenerateRefreshTokenService = {
  run: jest.fn(),
};

export const mockSignInService = {
  run: jest.fn(),
};

export const mockRefreshTokenService = {
  run: jest.fn(),
};

export const mockLogoutService = {
  run: jest.fn(),
};

export const mockVerifyTokenService = {
  run: jest.fn(),
};

export const auth: IServiceMock[] = [
  {
    provide: GenerateTokenService,
    useValue: mockGenerateTokenService,
  },
  {
    provide: GenerateRefreshTokenService,
    useValue: mockGenerateRefreshTokenService,
  },
  {
    provide: SignInService,
    useValue: mockSignInService,
  },
  {
    provide: RefreshTokenService,
    useValue: mockRefreshTokenService,
  },
  {
    provide: LogoutService,
    useValue: mockLogoutService,
  },
  {
    provide: VerifyTokenService,
    useValue: mockVerifyTokenService,
  },
];
