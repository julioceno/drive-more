import { IAuthorizedUser } from '@/common';
import { Observable } from 'rxjs';

export interface IGRPCAuthService {
  verifyToken(params: IVerifyTokenParams): Observable<IAuthorizedUser>;
}

export interface IVerifyTokenParams {
  token: string;
  clientId: string;
}
