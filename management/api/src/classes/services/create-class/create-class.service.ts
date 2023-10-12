import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { ClassEntity } from '@/classes/entities/class.entity';

@Injectable()
export class CreateClassService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: CreateClassDto, creatorEmail: string) {
    const classCreated = await this.createClass(dto);

    return new ClassEntity(classCreated);
  }

  private createClass(dto: CreateClassDto) {
    return this.prismaService.class.create({
      data: {
        categoryId: dto.categoryId,
        studentId: dto.studentId,
        instructorId: dto.instructorId,

        startAt: dto.startAt,
        endAt: dto.endAt,
      },
    });
  }
}
