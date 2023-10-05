import { PrismaService } from '@/prisma/prisma.service';
import { GenerateRefreshTokenService } from '../generate-refresh-token/generate-refresh-token.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { GenerateTokenService } from '../generate-token/generate-token.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { isAfter, fromUnixTime } from 'date-fns';
import { Resources, RoleEnum } from '@/common';
import { User } from '@prisma/client';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { ActionEnum } from '@/system-history/interface/system-history.interface';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(`@service/${RefreshTokenService.name}`);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly generateRefreshTokenService: GenerateRefreshTokenService,
    private readonly generateTokenService: GenerateTokenService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(dto: RefreshTokenDto) {
    const refreshToken = await this.getRefreshToken(dto.refreshTokenId);

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const { user } = refreshToken;

    const accessToken = await this.generateAccessToken({
      id: user.id,
      name: user.name,
      email: user.email,
      clientId: dto.clientId,
      role: user.role.name as RoleEnum,
    });

    const refreshTokenExpired = this.getRefreshTokenExpired(
      refreshToken.expiresIn,
    );

    if (refreshTokenExpired) {
      const newRefreshToken = await this.generateRefreshTokenService.run(
        user.id,
      );

      this.createRecordHistory(user);

      return { accessToken, refreshToken: newRefreshToken };
    }

    this.createRecordHistory(user);

    return { accessToken };
  }

  private getRefreshToken(refreshTokenId: string) {
    return this.prismaService.refreshToken.findUnique({
      where: {
        id: refreshTokenId,
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  private getRefreshTokenExpired(expiresIn: number) {
    const currentDate = new Date();
    const unitToDate = fromUnixTime(expiresIn);
    return isAfter(currentDate, unitToDate);
  }

  private generateAccessToken({
    id,
    clientId,
    email,
    name,
    role,
  }: {
    id: string;
    name: string;
    email: string;
    role: RoleEnum;
    clientId: string;
  }) {
    return this.generateTokenService.run({
      id,
      name,
      email,
      role,
      clientId,
    });
  }

  private async createRecordHistory(user: User) {
    const message = `Refresh token from user ${user.email} is concluded`;

    return this.systemHistoryProxyService
      .createRecordCustom({
        action: ActionEnum.OTHER,
        creatorEmail: user.email,
        entityId: user.code,
        payload: message,
        resourceName: Resources.AUTH,
      })
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }
}
