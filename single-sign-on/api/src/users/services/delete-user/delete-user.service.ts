import { Resources } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { UserEntity } from '@/users/entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class DeleteUserService {
  private readonly logger = new Logger(`@service/${DeleteUserService.name}`);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(id: string) {
    const user = await this.deleteUser(id);
    this.createRecordHistory(user);

    return new UserEntity(user);
  }

  private deleteUser(id: string) {
    return this.prismaService.user.delete({ where: { id } });
  }

  private async createRecordHistory(user: User) {
    return this.systemHistoryProxyService
      .createRecordStandard(user.email, ActionEnum.DELETE, user, Resources.USER)
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }
}
