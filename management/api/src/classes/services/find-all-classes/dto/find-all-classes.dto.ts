import { PaginationQueryDto } from '@/common';
import { Prisma } from '@prisma/client';

export class FindAllClassesDto extends PaginationQueryDto<Prisma.ClassOrderByWithAggregationInput> {}
