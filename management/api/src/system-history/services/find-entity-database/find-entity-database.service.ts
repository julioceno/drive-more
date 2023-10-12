import { Resources } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger, Res } from '@nestjs/common';
import { InstructorAdpter } from './adpters';
import { StudentAdpter } from './adpters/student.adpter';

@Injectable()
export class FindEntityDatabaseService {
  private readonly logger = new Logger(
    `@service/${FindEntityDatabaseService.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async run(entityId: string, resource: Resources) {
    const entity = await this.findEntity(entityId, resource);

    if (entity) {
      this.logger.log('Entity found');
    } else {
      this.logger.error('Entity not found');
    }

    return entity;
  }

  private findEntity(entityId: string, resource: Resources) {
    switch (resource) {
      case Resources.INSTRUCTOR:
        return this.findInstuctor(entityId);
      case Resources.STUDENT:
        return this.findStudent(entityId);
    }
  }

  private async findInstuctor(id: string) {
    const entity = await this.prismaService.instructor.findUnique({
      where: { id },
    });

    const adapter = new InstructorAdpter();
    const adptedData = adapter.adapt(entity);

    return adptedData;
  }

  private async findStudent(id: string) {
    const entity = await this.prismaService.student.findUnique({
      where: { id },
    });

    const adapter = new StudentAdpter();
    const adptedData = adapter.adapt(entity);

    return adptedData;
  }
}
