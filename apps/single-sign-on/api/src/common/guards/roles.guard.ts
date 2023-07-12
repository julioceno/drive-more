import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators';
import { IAuthorizedUserRequest } from '../interfaces';
import { RoleEnum } from '../enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<RoleEnum>(ROLE_KEY, context.getHandler());
    console.log('role', role);

    // if not have role metadata, return true allowed access in route
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
