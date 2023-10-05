import { Resources } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { InstructorAdpter } from './adpters';

@Injectable()
export class FindEntityDatabaseService {
  private readonly logger = new Logger(
    `@service/${FindEntityDatabaseService.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  run(entityId: string, resource: Resources) {
    const entity = this.findEntity(entityId, resource) as any; // TODO: remove any

    if (entity) {
      this.logger.log('Entity found');
    } else {
      this.logger.error('Entity not found');
    }

    return this.findEntity(entityId, resource);
  }

  private findEntity(entityId: string, resource: Resources) {
    switch (resource) {
      case Resources.INSTRUCTOR:
        return this.findInstuctor(entityId);
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
}
