import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { IAuthorizedUser } from '@/common/interfaces';

@Injectable()
export class VerifyTokenService {
  private readonly logger = new Logger(`@service/${VerifyTokenService.name}`);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async run(dto: VerifyTokenDto) {
    this.logger.log('Run VerifyTokenService');
    const { token } = dto;

    try {
      this.logger.log('Starting verify token');
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: this.getSecret(),
      })) as IAuthorizedUser;

      if (dto.clientId !== payload.clientId) {
        throw new ForbiddenException();
      }

      return { payload };
    } catch (err) {
      this.logger.error(`An error has occurred: ${err.message}`);
      throw new UnauthorizedException();
    }
  }

  private getSecret() {
    return this.configService.get('authToken.secret');
  }
}
