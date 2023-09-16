import { Messages, PaginationQueryDto } from '@/common';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FindAllDiffsRecordsDto extends PaginationQueryDto<Prisma.RecordOrderByWithAggregationInput> {
  @IsOptional()
  @Type(() => String)
  @IsString({ message: Messages.string('entityId') })
  entityId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: Messages.number('code') })
  code?: number;
}
