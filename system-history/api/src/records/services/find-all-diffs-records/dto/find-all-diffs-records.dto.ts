import { Messages, PaginationQueryDto } from '@/common';
import { Action, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class FindAllDiffsRecordsDto extends PaginationQueryDto<Prisma.RecordOrderByWithAggregationInput> {
  @IsOptional()
  @Type(() => String)
  @IsString({ message: Messages.string('entityId') })
  entityId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: Messages.number('code') })
  code?: number;

  @IsOptional()
  @IsString({ message: Messages.string('module') })
  module?: string;

  @IsOptional()
  @IsString({ message: Messages.string('resource') })
  resource?: string;

  @IsOptional()
  @IsEnum(Action, { message: Messages.enum('action', Action) })
  action?: Action;
}
