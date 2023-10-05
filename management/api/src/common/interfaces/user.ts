import { Request } from 'express';
import { RoleEnum } from '../enums';

export interface IAuthorizedUser {
  id: string;
  name: string;
  email: string;
  role: RoleEnum;
  clientId: string;
}

export interface IAuthorizedUserRequest extends Request {
  user: IAuthorizedUser;
}
