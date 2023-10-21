import { Resources } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { UserEntity } from '@/users/entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class DeleteUserService {
  private readonly logger = new Logger(`@services/${DeleteUserService.name}`);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(id: string, creatorEmail: string) {
    const user = await this.deleteUser(id);
    this.createRecordHistory(creatorEmail, user);

    return new UserEntity(user);
  }

  private deleteUser(id: string) {
    return this.prismaService.user.delete({ where: { id } });
  }

  private async createRecordHistory(creatorEmail: string, user: User) {
    return this.systemHistoryProxyService
      .createRecordStandard(
        creatorEmail,
        ActionEnum.DELETE,
        user,
        Resources.USER,
      )
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }
}
