import { PrismaService } from '@/prisma/prisma.service';
import { IGRPCAuthService } from '@/sso/interfaces';
import { Metadata } from '@grpc/grpc-js';
import {
  BadGatewayException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { retry } from '@/grpc/utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerifyTokenService implements OnModuleInit {
  private readonly logger = new Logger(`@services/${VerifyTokenService.name}`);

  private authService: IGRPCAuthService;

  constructor(
    @Inject('AUTH_PACKAGE') private client: ClientGrpc,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<IGRPCAuthService>('AuthService');
  }

  async run({ token }: VerifyTokenDto) {
    this.logger.log(`Getting auth status from params token=${token}`);

    try {
      const user = await retry(
        async () =>
          await firstValueFrom(
            this.authService.verifyToken({
              token,
              clientId: this.getClientId(),
            }),
          ),
        this.logger,
      );

      this.logger.log('Verify is successful');

      return user;
    } catch (err) {
      this.logger.error('There was an error');
      throw new BadGatewayException();
    }
  }

  private getClientId() {
    return this.configService.get('auth.clientId');
  }
}
