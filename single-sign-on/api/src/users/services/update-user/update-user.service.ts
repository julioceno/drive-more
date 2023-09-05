import { PrismaService } from '@/prisma/prisma.service';
import { UserEntity } from '@/users/entities/user.entity';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';

@Injectable()
export class UpdateUserService {
  private readonly logger = new Logger(`@service/${UpdateUserService.name}`);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(id: string, dto: UpdateUserDto) {
    const user = await this.getUser(id);

    if (!user) {
      throw new NotFoundException('Usuário não existe.');
    }

    const updatedUser = await this.updateUser(id, dto);

    this.createRecordHistory(updatedUser);

    return new UserEntity(updatedUser);
  }

  private getUser(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  private updateUser(id: string, dto: UpdateUserDto) {
    const { email, name } = dto;

    return this.prismaService.user.update({
      where: { id },
      data: { name, email },
    });
  }

  private async createRecordHistory(user: User) {
    return this.systemHistoryProxyService
      .createRecordStandard(user.email, ActionEnum.UPDATE, user, Resources.USER)
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }
}
