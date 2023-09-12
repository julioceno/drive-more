import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindAllDiffsRecordsDto } from './dto/find-all-diffs-records.dto';
import { Action, Prisma, Record } from '@prisma/client';
import { Messages, getPaginationQueryData } from '@/common';
import { getPayload } from '@/records/utils';

@Injectable()
export class FindAllDiffsRecordsService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: FindAllDiffsRecordsDto) {
    const records = await this.getRecords(dto);

    const promises = [];

    for (const record of records) {
      promises.push(this.formatRecord(record));
    }

    return Promise.all(promises);
  }

  private getRecords(dto: FindAllDiffsRecordsDto) {
    const where = this.buildWhere(dto);

    return this.prismaService.record.findMany({
      ...getPaginationQueryData(dto),
      orderBy: dto.sort ?? { createdAt: 'desc' },
      where,
    });
  }

  private buildWhere(dto: FindAllDiffsRecordsDto): Prisma.RecordWhereInput {
    const data = Prisma.validator<Prisma.RecordWhereInput>()({
      entityId: '3',
    });

    return data;
  }

  private async formatRecord(record: Record) {
    const { module, resource } = await this.getResourceNameAndModuleName(
      record.resourceId,
    );

    const diff = await this.createDiff(
      record.payload,
      record.entityId,
      record.createdAt,
      record.action,
    );

    delete record.payload;
    return { ...record, diff, module, resource };
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
    const isObject = typeof payload === 'object';

    if (!isObject) return payload;

    // TODO: improving this name
    const bla = () => {
      const entries = Object.entries(payload);

      const diffs = entries.map(([key, value]) =>
        this.createDiffField({ field: key, newValue: value }),
      );

      return diffs;
    };

    if (action !== Action.UPDATE) return bla();

    const recordOld = await this.getRecordOld(entityId, createdAt);

    if (!recordOld || typeof recordOld?.payload !== 'object') return bla();
    const oldPayload = recordOld.payload;

    const entries = Object.entries(payload);
    const oldEntries = Object.entries(oldPayload);

    const diffs = entries.map(([key, value]) => {
      const oldValue = oldEntries.find(([oldKey]) => {
        return key === oldKey;
      })[1];

      return this.createDiffField({ field: key, oldValue, newValue: value });
    });

    const dropDiffs = diffs.filter((item) => item.newValue !== item.oldValue);

    return dropDiffs;
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
