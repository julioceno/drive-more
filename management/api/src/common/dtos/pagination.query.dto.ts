import { Transform, Type } from 'class-transformer';
import { IsInt, IsObject, IsOptional } from 'class-validator';
import { messages } from '../messages';
import { mapValues } from '../functions';

export function getPaginationQueryData<T>(
  paginationQueryDto: PaginationQueryDto<T>,
) {
  return {
    take: paginationQueryDto.take ?? paginationQueryDto.limit,
    skip: paginationQueryDto.skip,
    orderBy: paginationQueryDto.sort,
  };
}

// O abstract é para informar que a classe é uma classe base, e que deve ser utilizada como complemento para outra
export abstract class PaginationQueryDto<T> {
  @IsOptional()
  @IsInt({
    message: messages.number('skip'),
  })
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsInt({
    message: messages.number('take'),
  })
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsInt({
    message: messages.number('limit'),
  })
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsObject({
    message: messages.object('sort'),
  })
  @Transform(({ value }) => mapValues(value))
  sort?: T;
}
