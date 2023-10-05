import { SsoService } from '@/sso/services/sso.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(`@guard/${AuthGuard.name}`);

  constructor(
    private readonly ssoService: SsoService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('Run AuthGuard');

    if (this.isPublic(context)) {
      this.logger.log('Public route');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.cookies.token;
    const user = await this.ssoService.verifyToken({ token });

    if (user) {
      request['user'] = user;
      this.logger.log('Token validated, auth complete');

      return true;
    }

    this.logger.log('Response fail, auth complete');

    return false;
  }

  private isPublic(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic;
  }
}
