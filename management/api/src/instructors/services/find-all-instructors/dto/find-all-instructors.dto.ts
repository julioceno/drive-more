import { messages, PaginationQueryDto } from '@/common';
import { Prisma } from '@prisma/client';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindAllInstructorsDto extends PaginationQueryDto<Prisma.InstructorOrderByWithAggregationInput> {
  @IsOptional()
  @IsUUID('4', { message: messages.uuid('id') })
  id?: string;

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
