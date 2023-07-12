import { Request } from 'express';
import { RoleEnum } from '../enums';

export interface IAuthorizedUser {
  id: string;
  role: RoleEnum;
}

export interface IAuthorizedUserRequest extends Request {
  user: IAuthorizedUser;
}
