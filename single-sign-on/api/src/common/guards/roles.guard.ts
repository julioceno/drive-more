import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators';
import { RoleEnum } from '../enums';
import { IAuthorizedUserRequest } from '../interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride<RoleEnum>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // if not have role metadata, return true allowed access
    if (!role) {
      return true;
    }

    const request = context.switchToHttp().getRequest<IAuthorizedUserRequest>();

    const user = request.user;
    const userRole = user.role;

    if (userRole === RoleEnum.ADMIN) {
      return true;
    }

    return userRole === role;
  }
}
