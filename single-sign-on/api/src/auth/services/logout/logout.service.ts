import { Resources } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LogoutService {
  private readonly logger = new Logger(`@service/${LogoutService.name}`);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(userId: string) {
    this.logger.log('Run LogoutService');

    await this.prismaService.refreshToken.deleteMany({
      where: { userId },
    });

    this.createRecordHistory(userId);

    this.logger.log(`Delete all refresh tokens from userId ${userId}`);
  }

  private async createRecordHistory(id: string) {
    const user = await this.getUser(id);

    const message = `User ${user.email} is deauthenticated`;

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

  private getUser(id: string) {
    return this.prismaService.user.findUnique({ where: { id } });
  }
}
