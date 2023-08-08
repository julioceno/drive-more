import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IAuthorizedUser } from 'dirigir-more-utils';

@Injectable()
export class GenerateTokenService {
  private readonly logger = new Logger(`@service/${GenerateTokenService.name}`);

  constructor(private jwtService: JwtService) {}

  async run(payload: IAuthorizedUser) {
    this.logger.log('run GenerateTokenService');

    const accessToken = await this.jwtService.signAsync(payload);
    this.logger.log(`Generated access token`);

    return accessToken;
  }
}
