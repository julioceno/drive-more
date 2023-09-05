import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { prisma } from 'prisma/seed';
import { LogEntity } from '@/logs/entities/log.entity';

@Injectable()
export class CreateLogService {
  private readonly logger = new Logger(`@services/${CreateLogService.name}`);

  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: CreateLogDto) {
    const module = await this.createOrRetriveModule(dto.moduleName);

    const resource = await this.createOrRetriveResource(
      dto.resourceName,
      module.id,
    );

    const record = await this.createLog(dto, resource.id);

    this.logger.log(`Record with code ${record.codigo} created`);
    return new LogEntity(record);
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

  private createLog(dto: CreateLogDto, resourceId: string) {
    return prisma.log.create({
      data: {
        action: dto.action,
        creatorEmail: dto.creatorEmail,
        entityId: dto.entityId,
        payload: dto.payload,
        resourceId,
      },
    });
  }
}
