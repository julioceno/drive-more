import { PrismaService } from '@/prisma/prisma.service';
import { ChangeRoleUserDto } from './dto/change-role-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '@/users/entities/user.entity';
import { RoleEnum } from '@/common';

@Injectable()
export class ChangeRoleUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: ChangeRoleUserDto) {
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
}
