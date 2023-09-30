import { Resources } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

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

  private findEntity(entityId: string, resource: Resources) {}
}
