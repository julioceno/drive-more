import { ClassEntity } from '@/classes/entities/class.entity';
import { messages } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FindOneClassService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(id: string) {
    const classRecord = await this.getClass(id);

    if (!classRecord) {
      throw new NotFoundException(messages.NOT_FOUND);
    }

    return new ClassEntity(classRecord);
  }

  private getClass(id: string) {
    return this.prismaService.class.findUnique({ where: { id } });
  }
}
