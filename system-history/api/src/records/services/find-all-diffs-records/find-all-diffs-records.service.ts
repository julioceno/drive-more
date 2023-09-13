import { PrismaService } from '@/prisma/prisma.service';
import {
  BadGatewayException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FindAllDiffsRecordsDto } from './dto/find-all-diffs-records.dto';
import { Action, Prisma, Record } from '@prisma/client';
import { Messages, getPaginationQueryData } from '@/common';
import { RecordDiffEntity } from '@/records/entities/record-diff.entity';
import { FindListEntity } from '@/common/entities';

@Injectable()
export class FindAllDiffsRecordsService {
  private readonly logger = new Logger(
    `@service/${FindAllDiffsRecordsDto.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: FindAllDiffsRecordsDto) {
    const where = this.buildWhere(dto);

    this.logger.log('Getting records to format...');
    const records = await this.getRecords(dto, where);

    const promises = [];

    this.logger.log('Preparing the records to format');
    for (const record of records) {
      promises.push(this.formatRecord(record));
    }
    this.logger.log('Records formatteds');

    const [recordsFormatted, totalCount] = await Promise.all([
      Promise.all(promises),
      this.getTotalCount(where),
    ]);

    const entities = recordsFormatted.map(
      (record) => new RecordDiffEntity(record),
    );

    this.logger.log('Instantiating records to return');

    return new FindListEntity(totalCount, entities);
  }

  private getRecords(
    dto: FindAllDiffsRecordsDto,
    where: Prisma.RecordWhereInput,
  ) {
    return this.prismaService.record.findMany({
      ...getPaginationQueryData(dto),
      orderBy: dto.sort ?? { createdAt: 'desc' },
      where,
    });
  }

  private getTotalCount(where: Prisma.RecordWhereInput) {
    return this.prismaService.record.count({ where });
  }

  private buildWhere(dto: FindAllDiffsRecordsDto): Prisma.RecordWhereInput {
    const data = Prisma.validator<Prisma.RecordWhereInput>()({});

    return data;
  }

  private async formatRecord(record: Record) {
    const { module, resource } = await this.getResourceNameAndModuleName(
      record.resourceId,
    );

    const diffs = await this.createDiff(
      record.payload,
      record.entityId,
      record.createdAt,
      record.action,
    );

    delete record.payload;
    return { ...record, diffs, module, resource };
  }

  private async getResourceNameAndModuleName(resourceId: string) {
    const resourceWithInclude = await this.prismaService.resource.findUnique({
      where: {
        id: resourceId,
      },
      select: {
        name: true,
        Module: {
          select: { name: true },
        },
      },
    });

    if (!resourceWithInclude) {
      throw new NotFoundException(Messages.NOT_FOUND_CUSTOM('Resource'));
    }

    const resource = resourceWithInclude.name;
    const module = resourceWithInclude.Module.name;

    return { resource, module };
  }

  private async createDiff(
    payload: Prisma.JsonValue,
    entityId: string,
    createdAt: Date,
    action: Action,
  ) {
    try {
      const isObject = typeof payload === 'object';

      if (!isObject) return payload;

      if (action !== Action.UPDATE)
        return this.createDiffFieldWithoutOldalue(payload);

      const recordOld = await this.getRecordOld(entityId, createdAt);

      if (!recordOld || typeof recordOld?.payload !== 'object')
        return this.createDiffFieldWithoutOldalue(payload);

      const oldPayload = recordOld.payload;

      const entries = Object.entries(payload);
      const oldEntries = Object.entries(oldPayload);

      const diffs = entries.map(([key, value]) => {
        const oldValue = oldEntries.find(([oldKey]) => key === oldKey)[1];
        return this.createDiffField({ field: key, oldValue, newValue: value });
      });

      const dispatchDiffs = diffs.filter(
        (item) => item.newValue !== item.oldValue,
      );

      return dispatchDiffs;
    } catch (error) {
      const message = 'Ocurred an error in create diff';

      this.logger.error(`${message}, error: ${error}`);
      throw new BadGatewayException(`${message}.`);
    }
  }

  private createDiffFieldWithoutOldalue(payload: Prisma.JsonValue) {
    const entries = Object.entries(payload);

    const diffs = entries.map(([key, value]) =>
      this.createDiffField({ field: key, newValue: value }),
    );

    return diffs;
  }

  private createDiffField({
    field,
    newValue,
    oldValue,
  }: {
    field: string;
    oldValue?: Prisma.JsonValue;
    newValue: Prisma.JsonValue;
  }) {
    return {
      field,
      oldValue: oldValue ?? null,
      newValue: newValue,
    };
  }

  private getRecordOld(entityId: string, createdAt: Date) {
    return this.prismaService.record.findFirst({
      where: {
        entityId,
        createdAt: {
          lt: createdAt,
        },
        OR: [{ action: Action.CREATE }, { action: Action.UPDATE }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
