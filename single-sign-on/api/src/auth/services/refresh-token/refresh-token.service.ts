import { PrismaService } from '@/prisma/prisma.service';
import { GenerateRefreshTokenService } from '../generate-refresh-token/generate-refresh-token.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GenerateTokenService } from '../generate-token/generate-token.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { isAfter, fromUnixTime } from 'date-fns';
import { RoleEnum } from '@/common';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly generateRefreshTokenService: GenerateRefreshTokenService,
    private readonly generateTokenService: GenerateTokenService,
  ) {}

  async run(dto: RefreshTokenDto) {
    const refreshToken = await this.getRefreshToken(dto.refreshTokenId);

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const { user } = refreshToken;

    const accessToken = await this.generateAccessToken(
      user.id,
      user.role.name,
      dto.clientId,
    );

    const refreshTokenExpired = this.getRefreshTokenExpired(
      refreshToken.expiresIn,
    );

    if (refreshTokenExpired) {
      const newRefreshToken = await this.generateRefreshTokenService.run(
        user.id,
      );
      return { accessToken, refreshToken: newRefreshToken };
    }

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

  private generateAccessToken(userId: string, role: string, clientId: string) {
    return this.generateTokenService.run({
      id: userId,
      role: role as RoleEnum,
      clientId,
    });
  }
}
