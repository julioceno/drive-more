import { getPaginationQueryData } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FindAllStudentsDto } from './dto/find-all-students.dto';
import { StudentEntity } from '@/students/entities/student.entity';
import { FindListEntity } from '@/common/entities';

@Injectable()
export class FindAllStudentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: FindAllStudentsDto) {
    const where = this.buildWhere(dto);

    const [students, totalCount] = await this.getStudents(dto, where);

    const entities = students.map((student) => new StudentEntity(student));

    return new FindListEntity(totalCount, entities);
  }

  private buildWhere(dto: FindAllStudentsDto) {
    const data = Prisma.validator<Prisma.StudentWhereInput>()({
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

  private getStudents(
    dto: FindAllStudentsDto,
    where: Prisma.StudentWhereInput,
  ) {
    const select = {
      ...getPaginationQueryData(dto),
      orderBy: dto.sort ?? { createdAt: 'desc' },
      where,
    };

    return Promise.all([
      this.prismaService.student.findMany(select),
      this.prismaService.student.count(select),
    ]);
  }
}
