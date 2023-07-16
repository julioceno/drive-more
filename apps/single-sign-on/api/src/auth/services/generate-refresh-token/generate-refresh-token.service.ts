import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { addSeconds, getUnixTime } from 'date-fns';

@Injectable()
export class GenerateRefreshTokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async run(userId: string) {
    await this.deleteOldsRefreshToken(userId);
    const expiresIn = this.getExpiresIn();

    return this.createRefreshToken(userId, expiresIn);
  }

  private getExpiresIn() {
    const refreshTokenTTL = this.getRefreshTokenTTL();
    return getUnixTime(addSeconds(new Date(), refreshTokenTTL));
  }

  private getRefreshTokenTTL() {
    return this.configService.get<number>('refreshToken.expiration');
  }

  private deleteOldsRefreshToken(userId: string) {
    return this.prismaService.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  private createRefreshToken(userId: string, expiresIn: number) {
    return this.prismaService.refreshToken.create({
      data: {
        userId,
        expiresIn,
      },
    });
  }
}
