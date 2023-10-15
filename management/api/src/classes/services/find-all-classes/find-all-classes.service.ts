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

    const [classes, totalCount] = await Promise.all([
      this.getClasses(dto, where),
      this.getTotalCount(dto, where),
    ]);

    const entities = classes.map((classRecord) => new ClassEntity(classRecord));

    return new FindListEntity(totalCount, entities);
  }

  private buildWhere(dto: FindAllClassesDto) {
    const data = Prisma.validator<Prisma.StudentWhereInput>()({});
    return data;
  }

  private getClasses(dto: FindAllClassesDto, where: Prisma.ClassWhereInput) {
    return this.prismaService.class.findMany({
      ...getPaginationQueryData(dto),
      where,
    });
  }

  private getTotalCount(dto: FindAllClassesDto, where: Prisma.ClassWhereInput) {
    return this.prismaService.class.count({
      ...getPaginationQueryData(dto),
      where,
    });
  }
}
