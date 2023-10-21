import { Injectable } from '@nestjs/common';
import { FindAllClassesDto } from './dto/find-all-classes.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { getPaginationQueryData } from '@/common';
import { ClassEntity } from '@/classes/entities/class.entity';
import { FindListEntity } from '@/common/entities';

@Injectable()
export class FindAllClassesService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: FindAllClassesDto) {
    const where = this.buildWhere(dto);

    const [classes, totalCount] = await this.getClasses(dto, where);

    const entities = classes.map((classRecord) => new ClassEntity(classRecord));

    return new FindListEntity(totalCount, entities);
  }

  private buildWhere(dto: FindAllClassesDto) {
    const data = Prisma.validator<Prisma.StudentWhereInput>()({});
    return data;
  }

  private getClasses(dto: FindAllClassesDto, where: Prisma.ClassWhereInput) {
    const select = {
      ...getPaginationQueryData(dto),
      orderBy: dto.sort ?? { createdAt: 'desc' },
      where,
    };

    return Promise.all([
      this.prismaService.class.findMany(select),
      this.prismaService.class.count(select),
    ]);
  }
}
