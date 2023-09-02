import { Injectable, Logger } from '@nestjs/common';
import { CreateRecordService } from '../create-record/create-record.service';
import {
  ActionEnum,
  ICreateRecordParams,
} from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';
import { FindEntityDatabaseService } from '../find-entity-database/find-entity-database.service';
import { formatToPrismaJsonObject } from '@/system-history/utils';

@Injectable()
export class SystemHistoryProxyService {
  private readonly logger = new Logger(
    `@service/${SystemHistoryProxyService.name}`,
  );

  constructor(
    private readonly createRecordService: CreateRecordService,
    private readonly findEntityDatabaseService: FindEntityDatabaseService,
  ) {}

  async createRecordCustom(dto: Omit<ICreateRecordParams, 'modelName'>) {
    this.logger.log('Creating log with payload custom');

    return await this.createRecordService.run({
      action: dto.action,
      creatorEmail: dto.creatorEmail,
      entityId: dto.entityId,
      resourceName: dto.resourceName,
      payload: dto.payload,
    });
  }

  async createRecordStandard<T extends { id: string }>(
    creatorEmail: string,
    action: ActionEnum,
    entity: T,
    resource: Resources,
  ) {
    try {
      const { id: entityId, payload } = await this.createEntityToDispatch(
        action,
        entity,
        resource,
      );

      return this.createRecordService.run({
        action,
        creatorEmail,
        entityId,
        resourceName: resource,
        payload,
      });
    } catch (err) {
      this.logger.error(`there was an error: ${err}`);
    }
  }

  private async createEntityToDispatch<T extends { id: string }>(
    action: ActionEnum,
    entity: T,
    resource: Resources,
  ) {
    this.logger.log(`Search data in database: ${resource}.${entity.id}`);

    const entityFromDB = await this.findEntityDatabaseService.run(
      entity.id,
      resource,
    );

    const payload = formatToPrismaJsonObject(
      action === ActionEnum.DELETE ? entity : entityFromDB,
    );

    return {
      id: entity.id,
      payload,
    };
  }
}
