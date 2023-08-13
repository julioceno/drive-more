import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LogoutService {
  private readonly logger = new Logger(`@service/${LogoutService.name}`);

  constructor(private readonly prismaService: PrismaService) {}

  async run(userId: string) {
    this.logger.log('Run LogoutService');

    await this.prismaService.refreshToken.deleteMany({
      where: { userId },
    });
    this.logger.log(`Delete all refresh tokens from userId ${userId}`);
  }
}
