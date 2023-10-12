import { messages } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { StudentEntity } from '@/students/entities/student.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FindOneStudentService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(id: string) {
    const student = await this.getStudent(id);

    if (!student) {
      throw new NotFoundException(messages.NOT_FOUND);
    }

    return new StudentEntity(student);
  }

  private getStudent(id: string) {
    return this.prismaService.student.findUnique({ where: { id } });
  }
}
