import { PrismaService } from '@/prisma/prisma.service';
import { ChangeRoleDto } from './dto/change-role.dto';
import { Role } from './utils/roles';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '@/users/entities/user.entity';

@Injectable()
export class ChangeRoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: ChangeRoleDto) {
    const { role, userId } = dto;

    await Promise.all([
      this.verifyRoleExists(role),
      this.verifyUserExists(userId),
    ]);

    const user = await this.changeRoleFromUser(userId, role);

    return new UserEntity(user);
  }

  private async verifyUserExists(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  private async verifyRoleExists(name: Role) {
    const role = await this.prismaService.role.findUnique({
      where: { name },
    });

    if (!role) {
      throw new NotFoundException('Role não encontrada.');
    }
  }

  private changeRoleFromUser(userId: string, roleName: Role) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { role: { connect: { name: roleName } } },
      include: { role: true },
    });
  }
}
