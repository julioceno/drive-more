import { IServiceMock } from '../../../common/interfaces/index';
import { VerifyTokenService } from '@/sso/services/verify-token/verify-token.service';

export const mockVerifyTokenService = {
  run: jest.fn(),
};

export const singleSignOn: IServiceMock[] = [
  {
    provide: VerifyTokenService,
    useValue: mockVerifyTokenService,
  },
];
