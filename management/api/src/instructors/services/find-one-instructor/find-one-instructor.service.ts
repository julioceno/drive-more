import { messages } from '@/common';
import { InstructorEntity } from '@/instructors/entities/instructor.entity';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FindOneInstructorService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(id: string) {
    const instructor = await this.getInstructor(id);

    if (!instructor) {
      throw new NotFoundException(messages.NOT_FOUND);
    }

    return new InstructorEntity(instructor);
  }

  private getInstructor(id: string) {
    return this.prismaService.instructor.findUnique({ where: { id } });
  }
}
