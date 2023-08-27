import { getArrayFromPrismaEnum } from './get-array-from-prisma-enum';

export function allowedStatusGeneric<T>(params: T): string {
  return getArrayFromPrismaEnum(params).join(', ');
}
