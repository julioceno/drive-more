import { SsoService } from '@/sso/services/sso.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(`@guard/${AuthGuard.name}`);

  constructor(private readonly ssoService: SsoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.token;

    const response = await this.ssoService.verifyToken({ token });

    if (response) {
      this.logger.log('Token validated, auth complete');

      return true;
    }

    this.logger.log('Response fail, auth complete');

    return false;
  }
}
