import { PrismaService } from '@/prisma/prisma.service';
import { UserEntity } from '@/users/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UpdateUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(id: string, dto: UpdateUserDto) {
    const user = await this.getUser(id);

    if (!user) {
      throw new NotFoundException('Usuário não existe.');
    }

    const updatedUser = await this.updateUser(id, dto);

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
}
