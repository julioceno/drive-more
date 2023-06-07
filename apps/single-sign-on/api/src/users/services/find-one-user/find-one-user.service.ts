import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class FindOneUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(id: string) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id },
    });

    return new UserEntity(user);
  }
}
