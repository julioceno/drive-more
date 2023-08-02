import { Request } from 'express';
import { RoleEnum } from '../enums';

export interface IAuthorizedUser {
  id: string;
  role: RoleEnum;
  clientId: string;
}

export interface IAuthorizedUserRequest extends Request {
  user: IAuthorizedUser;
}
