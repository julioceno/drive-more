import { PaginationQueryDto, messages } from '@/common';
import { Prisma } from '@prisma/client';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindAllStudentsDto extends PaginationQueryDto<Prisma.StudentOrderByWithAggregationInput> {
  @IsOptional()
  @IsInt({ message: messages.number('code') })
  code?: number;

  @IsOptional()
  @IsString({ message: messages.string('name') })
  name?: string;

  @IsOptional()
  @IsString({ message: messages.string('cpf') })
  cpf?: string;
}
