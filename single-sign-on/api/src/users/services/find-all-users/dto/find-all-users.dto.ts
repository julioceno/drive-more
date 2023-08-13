import { PaginationQueryDto } from '@/common';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Messages } from '@/common';
import { Prisma } from 'prisma/types/client';

export class FindAllUsersDto extends PaginationQueryDto<Prisma.UserOrderByWithAggregationInput> {
  @IsOptional()
  @IsString({ message: Messages.string('name') })
  name?: string;

  @IsOptional()
  @IsString({ message: Messages.string('email') })
  @IsEmail({}, { message: Messages.email('email') })
  email?: string;
}
