import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { addSeconds, getUnixTime } from 'date-fns';

@Injectable()
export class GenerateRefreshTokenService {
  private readonly logger = new Logger(
    `@service/${GenerateRefreshTokenService.name}`,
  );

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async run(userId: string) {
    this.logger.log('Run GenerateRefreshTokenService');

    await this.deleteOldsRefreshToken(userId);
    this.logger.log(`Delete all refresh tokens from userId ${userId}`);

    const expiresIn = this.getExpiresIn();
    const refreshToken = await this.createRefreshToken(userId, expiresIn);
    this.logger.log(
      `New refresh token generated with expires in: ${expiresIn}`,
    );

    return refreshToken;
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
