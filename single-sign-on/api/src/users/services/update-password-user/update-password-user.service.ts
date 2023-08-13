import { PrismaService } from '@/prisma/prisma.service';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '@/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdatePasswordUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(id: string, dto: UpdatePasswordUserDto) {
    const user = await this.getUser(id);

    if (!user) {
      throw new NotFoundException('Usuário não existe.');
    }

    this.validatePassword(dto.currentPassword, user.password);

    const updatedUser = await this.updatePassword(id, dto.password);

    return new UserEntity(updatedUser);
  }

  private getUser(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  private updatePassword(id: string, password: string) {
    const passwordEncrypted = bcrypt.hashSync(password, 8);

    return this.prismaService.user.update({
      where: { id },
      data: { password: passwordEncrypted },
    });
  }

  private validatePassword(password: string, entityPassword: string) {
    const isEqualPasswords = bcrypt.compareSync(password, entityPassword);

    if (!isEqualPasswords) {
      throw new UnauthorizedException();
    }
  }
}
