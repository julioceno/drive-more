import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { IAuthorizedUserRequest } from '@/common';

export const IS_USER_KEY = 'isPublic';

export const AuthorizedUser = createParamDecorator(
  async (prop: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IAuthorizedUserRequest>();

    return prop ? request.user?.[prop] : request.user;
  },
);
