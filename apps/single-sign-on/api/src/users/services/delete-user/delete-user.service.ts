import { PrismaService } from '@/prisma/prisma.service';
import { UserEntity } from '@/users/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(id: string) {
    const entity = await this.deleteUser(id);

    return new UserEntity(entity);
  }

  private deleteUser(id: string) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
