import { GenerateRefreshTokenService } from '@/auth/services/generate-refresh-token/generate-refresh-token.service';
import { GenerateTokenService } from '@/auth/services/generate-token/generate-token.service';
import { IServiceMock } from './servicesMocks';

export const mockGenerateTokenService = {
  run: jest.fn(),
};

export const mockGenerateRefreshTokenService = {
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
];
