import { Request } from 'express';

export interface IAuthorizedUser {
  id: string;
}

export interface IAuthorizedUserRequest extends Request {
  user: IAuthorizedUser;
}
