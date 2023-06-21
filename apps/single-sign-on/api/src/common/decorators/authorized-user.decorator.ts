import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthorizedUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user[data] : request.user;
  },
);
