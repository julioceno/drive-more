import { PrismaService } from '@/prisma/prisma.service';
import { ChangeRoleUserDto } from './dto/change-role-user.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserEntity } from '@/users/entities/user.entity';
import { Resources, RoleEnum } from '@/common';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { User } from '@prisma/client';
import { ActionEnum } from '@/system-history/interface/system-history.interface';

@Injectable()
export class ChangeRoleUserService {
  private readonly logger = new Logger(
    `@service/${ChangeRoleUserService.name}`,
  );

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(creatorEmail: string, dto: ChangeRoleUserDto) {
    const { role, userId } = dto;

    await Promise.all([
      this.verifyRoleExists(role),
      this.verifyUserExists(userId),
    ]);

    const user = await this.changeRoleFromUser(userId, role);

    this.createRecordHistory(creatorEmail, user);

    return new UserEntity(user);
  }

  private async verifyUserExists(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }

  private async verifyRoleExists(name: RoleEnum) {
    const role = await this.prismaService.role.findUnique({
      where: { name },
    });

    if (!role) {
      throw new NotFoundException('Role não encontrada.');
    }
  }

  private changeRoleFromUser(userId: string, roleName: RoleEnum) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { role: { connect: { name: roleName } } },
      include: { role: true },
    });
  }

  private async createRecordHistory(creatorEmail: string, user: User) {
    return this.systemHistoryProxyService
      .createRecordStandard(
        creatorEmail,
        ActionEnum.UPDATE,
        user,
        Resources.USER,
      )
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }
}
