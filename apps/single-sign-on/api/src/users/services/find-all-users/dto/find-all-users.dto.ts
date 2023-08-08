import { PaginationQueryDto } from '@/common';
import { Prisma } from '@prisma/client';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Messages } from 'dirigir-more-utils';

export class FindAllUsersDto extends PaginationQueryDto<Prisma.UserOrderByWithAggregationInput> {
  @IsOptional()
  @IsString({ message: Messages.string('name') })
  name?: string;

  @IsOptional()
  @IsString({ message: Messages.string('email') })
  @IsEmail({}, { message: Messages.email('email') })
  email?: string;
}
