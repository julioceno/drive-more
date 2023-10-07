import { IsCPF, Messages } from '@/common';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindAllInstructorsDto {
  @IsOptional()
  @IsUUID('4', { message: Messages.uuid('id') })
  id?: string;

  @IsOptional()
  @IsInt({ message: Messages.number('code') })
  code?: number;

  @IsOptional()
  @IsString({ message: Messages.string('name') })
  name?: string;

  @IsOptional()
  @IsString({ message: Messages.string('cpf') })
  cpf?: string;
}
