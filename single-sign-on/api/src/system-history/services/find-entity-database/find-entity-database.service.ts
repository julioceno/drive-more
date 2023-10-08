import { Resources } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { UserAdpter } from './adpters';

@Injectable()
export class FindEntityDatabaseService {
  private readonly logger = new Logger(
    `@service/${FindEntityDatabaseService.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  run(entityId: string, resource: Resources) {
    const entity = this.findEntity(entityId, resource);

    if (entity) {
      this.logger.log('Entity found');
    } else {
      this.logger.error('Entity not found');
    }

    return entity;
  }

  private findEntity(entityId: string, resource: Resources) {
    switch (resource) {
      case Resources.USER:
        return this.findUser(entityId);
    }
  }

  private async findUser(id: string) {
    const entity = await this.prismaService.user.findUnique({
      where: { id },
      include: { role: true },
    });

    const adapter = new UserAdpter();
    const adptedData = adapter.adapt(entity);

    return adptedData;
  }
}
