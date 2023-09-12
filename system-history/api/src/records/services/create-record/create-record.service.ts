import { PrismaService } from '@/prisma/prisma.service';
import { RecordEntity } from '@/records/entities/record.entity';
import { Injectable, Logger } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { getPayload } from '@/records/utils';

@Injectable()
export class CreateRecordService {
  private readonly logger = new Logger(`@services/${CreateRecordService.name}`);

  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: CreateRecordDto) {
    const module = await this.createOrRetriveModule(dto.moduleName);

    const resource = await this.createOrRetriveResource(
      dto.resourceName,
      module.id,
    );

    const record = await this.createRecord(dto, resource.id);

    this.logger.log(`Record with code ${record.code} created`);
    return new RecordEntity(record);
  }

  private async createOrRetriveModule(moduleName: string) {
    this.logger.log(`Getting module ${moduleName}`);
    const module = await this.prismaService.module.findUnique({
      where: { name: moduleName },
    });

    if (module) {
      this.logger.log('Module obtained');
      return module;
    }

    this.logger.log('Module not found, creating this module...');
    return this.prismaService.module.create({
      data: {
        name: moduleName,
      },
    });
  }

  private async createOrRetriveResource(
    resourceName: string,
    moduleId: string,
  ) {
    this.logger.log(`Getting resource ${resourceName}`);
    const resource = await this.prismaService.resource.findFirst({
      where: {
        name: resourceName,
        moduleId,
      },
    });

    if (resource) {
      this.logger.log('Resource obtained');
      return resource;
    }

    this.logger.log(`Resource not found, creating this resource`);
    return this.prismaService.resource.create({
      data: {
        name: resourceName,
        moduleId,
      },
    });
  }

  private createRecord(dto: CreateRecordDto, resourceId: string) {
    return this.prismaService.record.create({
      data: {
        action: dto.action,
        creatorEmail: dto.creatorEmail,
        entityId: dto.entityId,
        payload: getPayload(dto.payload),
        resourceId,
      },
    });
  }
}
