import { IS_PUBLIC_KEY } from '@/common';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(`@guard/${AuthGuard.name}`);

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    this.logger.log('Run AuthGuard');
    if (this.isPublic(context)) {
      this.logger.log('Public route');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.cookies.token;

    if (!token) {
      this.logger.log('Not has token');
      throw new UnauthorizedException();
    }

    try {
      this.logger.log('Starting verify token');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.getSecret(),
      });

      request['user'] = payload;
      this.logger.log('Token verifyed');
    } catch (err) {
      this.logger.log('An error has occurred');
      throw new UnauthorizedException();
    }

    return true;
  }

  private isPublic(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic;
  }

  private getSecret() {
    return this.configService.get('authToken.secret');
  }
}
