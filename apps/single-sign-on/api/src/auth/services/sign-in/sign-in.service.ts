import { Public } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { GenerateRefreshTokenService } from '../generate-refresh-token/generate-refresh-token.service';
import { GenerateTokenService } from '../generate-token/generate-token.service';
import { SignInDto } from './dto/sign-in.dto';
import { RoleEnum } from 'dirigir-more-utils';

@Injectable()
@Public()
export class SignInService {
  private readonly logger = new Logger(`@service/${SignInService.name}`);

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
    private readonly prismaService: PrismaService,
    private readonly generateTokenService: GenerateTokenService,
    private readonly refreshTokenService: GenerateRefreshTokenService,
    private readonly configService: ConfigService,
  ) {}

  async run(dto: SignInDto) {
    this.logger.log('run SignInService');
    const { email, password, clientId } = dto;

    const user = await this.getUser(email);
    if (!user) {
      this.unauthorized();
    }

    this.logger.log(`Get user with id ${user.id}`);

    const isEqualPasswords = bcrypt.compareSync(password, user.password);

    if (!isEqualPasswords) {
      this.unauthorized();
    }

    const canAuthenticate = this.verifyCanAuthenticate(
      user.role.name as RoleEnum,
      clientId,
    );

    this.logger.log(
      `User is ${
        canAuthenticate ? 'authorized' : 'not authorized'
      } to access this system with client id ${clientId}`,
    );

    if (!canAuthenticate) {
      this.unauthorized('User not authorized to access this system.');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateTokenService.run({
        id: user.id,
        role: user.role.name as RoleEnum,
        clientId: dto.clientId,
      }),
      this.refreshTokenService.run(user.id),
    ]);

    return { accessToken, refreshToken };
  }

  private async getUser(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });
  }

  private verifyCanAuthenticate(role: RoleEnum, clientId: string) {
    return this.possibleAuthenticate.get(role).includes(clientId);
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

  private unauthorized(message?: string) {
    this.logger.log(message ?? 'User unauthorized');

    throw new UnauthorizedException(message);
  }
}
