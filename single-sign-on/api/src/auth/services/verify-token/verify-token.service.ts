import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { IAuthorizedUser, RoleEnum } from '@/common';

@Injectable()
export class VerifyTokenService {
  private readonly logger = new Logger(`@service/${VerifyTokenService.name}`);

  private readonly possibleAuthenticate: Map<RoleEnum, string[]> = new Map([
    [
      RoleEnum.ADMIN,
      [
        this.getSSOClientId(),
        this.getLogsClientId(),
        this.getSchedulingClientId(),
      ],
    ],
    [RoleEnum.USER, [this.getSSOClientId(), this.getSchedulingClientId()]],
  ]);
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

      const possibleAuthenticate = this.possibleAuthenticate.get(payload.role);

      if (!possibleAuthenticate.includes(dto.clientId)) {
        throw new ForbiddenException();
      }

      return payload;
    } catch (err) {
      this.logger.error(`An error has occurred: ${err.message}`);
      throw new UnauthorizedException();
    }
  }

  private getSecret() {
    return this.configService.get('authToken.secret');
  }

  private getSSOClientId() {
    return this.configService.get<string>('clientsIds.authClientId');
  }

  private getLogsClientId() {
    return this.configService.get<string>('clientsIds.logsClientId');
  }

  private getSchedulingClientId() {
    return this.configService.get<string>('clientsIds.schedulingClientId');
  }
}
