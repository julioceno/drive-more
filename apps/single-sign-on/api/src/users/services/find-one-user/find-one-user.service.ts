import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserEntity } from '../../entities/user.entity';
import { Messages } from 'dirigir-more-utils';

@Injectable()
export class FindOneUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(id: string) {
    const user = await this.getUser(id);

    if (!user) {
      throw new NotFoundException(Messages.NOT_FOUND);
    }

    return new UserEntity(user);
  }

  private getUser(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }
}
