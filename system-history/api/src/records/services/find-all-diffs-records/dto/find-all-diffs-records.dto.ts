import { Messages, PaginationQueryDto } from '@/common';
import { Prisma, Record } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FindAllDiffsRecordsDto extends PaginationQueryDto<Prisma.RecordOrderByWithAggregationInput> {
  @IsOptional()
  @Type(() => String)
  @IsString({ message: Messages.string('entityId') })
  entityId: string;
}
