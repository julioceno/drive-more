import { GenerateTokenService } from '@/auth/services/generate-token/generate-token.service';
import { RefreshTokenService } from '@/auth/services/refresh-token/refresh-token.service';
import { IServiceMock } from './servicesMocks';
import { GenerateRefreshTokenService } from '@/auth/services/generate-refresh-token/generate-refresh-token.service';

export const mockGenerateTokenService = {
  run: jest.fn(),
};

export const mockRefreshTokenService = {
  run: jest.fn(),
};

export const auth: IServiceMock[] = [
  {
    provide: GenerateTokenService,
    useValue: mockGenerateTokenService,
  },
  {
    provide: GenerateRefreshTokenService,
    useValue: mockRefreshTokenService,
  },
];
