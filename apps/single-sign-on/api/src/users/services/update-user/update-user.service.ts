import { PrismaService } from '@/prisma/prisma.service';
import { UserEntity } from '@/users/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: UpdateUserDto) {
    const user = await this.getUser(dto.email);

    if (!user) {
      throw new NotFoundException('Usuário não existe.');
    }

    const newPasswordEncrypted = bcrypt.hashSync(dto.password, 8);

    const updatedUser = await this.updateUser({
      ...dto,
      password: newPasswordEncrypted,
    });

    return new UserEntity(updatedUser);
  }

  private getUser(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  private updateUser(dto: UpdateUserDto) {
    const { email, password, name } = dto;

    return this.prismaService.user.update({
      where: { email },
      data: { name, email, password },
    });
  }
}
