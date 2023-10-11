import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { FindAllInstructorsDto } from './dto/find-all-instructors.dto';
import { Prisma } from '@prisma/client';
import { InstructorEntity } from '@/instructors/entities/instructor.entity';
import { FindListEntity } from '@/common/entities';
import { getPaginationQueryData } from '@/common';

@Injectable()
export class FindAllInstructorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: FindAllInstructorsDto) {
    const where = this.buildWhere(dto);

    const [instructors, totalCount] = await Promise.all([
      this.getInsturctors(dto, where),
      this.getTotalCount(where),
    ]);

    const entities = instructors.map(
      (instructor) => new InstructorEntity(instructor),
    );

    return new FindListEntity(totalCount, entities);
  }

  private buildWhere(dto: FindAllInstructorsDto) {
    const data = Prisma.validator<Prisma.InstructorWhereInput>()({
      code: dto.code,
      name: {
        contains: dto.name,
        mode: 'insensitive',
      },
      cpf: {
        contains: dto.cpf,
        mode: 'insensitive',
      },
    });

    return data;
  }

  private getInsturctors(
    dto: FindAllInstructorsDto,
    where: Prisma.InstructorWhereInput,
  ) {
    return this.prismaService.instructor.findMany({
      ...getPaginationQueryData(dto),
      orderBy: dto.sort ?? { createdAt: 'desc' },
      where,
    });
  }

  private getTotalCount(where: Prisma.InstructorWhereInput) {
    return this.prismaService.instructor.count({ where });
  }
}
