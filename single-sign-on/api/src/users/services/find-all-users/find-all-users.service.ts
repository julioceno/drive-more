import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { getPaginationQueryData } from '@/common';
import { UserEntity } from '@/users/entities/user.entity';
import { FindListEntity } from '@/common/entities/find-list.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class FindAllUsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: FindAllUsersDto) {
    const where = this.buildWhere(dto);

    const [users, totalCount] = await Promise.all([
      this.getUsers(dto, where),
      this.getTotalCount(where),
    ]);

    const entities = users.map((user) => new UserEntity(user));
    return new FindListEntity(totalCount, entities);
  }

  private buildWhere(dto: FindAllUsersDto) {
    const { name, email } = dto;

    const data = Prisma.validator<Prisma.UserWhereInput>()({
      name: {
        contains: name,
        mode: 'insensitive',
      },
      email: {
        contains: email,
        mode: 'insensitive',
      },
    });

    return data;
  }

  private getUsers(dto: FindAllUsersDto, where: Prisma.UserWhereInput) {
    return this.prismaService.user.findMany({
      ...getPaginationQueryData(dto),
      orderBy: dto.sort ?? { createdAt: 'desc' },
      where,
    });
  }

  private getTotalCount(where: Prisma.UserWhereInput) {
    return this.prismaService.user.count({ where });
  }
}
