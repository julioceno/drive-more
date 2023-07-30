import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { VerifyTokenDto } from './dto/verify-token.dto';

@Injectable()
export class VerifyTokenService {
  private readonly logger = new Logger(`@guard/${VerifyTokenService.name}`);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async run(dto: VerifyTokenDto) {
    this.logger.log('Run VerifyTokenService');
    const { token } = dto;

    try {
      this.logger.log('Starting verify token');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.getSecret(),
      });

      this.logger.log('Token verifyed');

      return { ok: true, payload };
    } catch (err) {
      this.logger.error(`An error has occurred: ${err.message}`);

      return { ok: false, message: err.message };
    }
  }

  private getSecret() {
    return this.configService.get('authToken.secret');
  }
}
