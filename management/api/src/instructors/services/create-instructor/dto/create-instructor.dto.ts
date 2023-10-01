import { IsCPF, Messages } from '@/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInstructorDto {
  @IsNotEmpty({ message: Messages.required('name') })
  @IsString({ message: Messages.string('name') })
  name: string;

  @IsNotEmpty({ message: Messages.required('cpf') })
  @IsString({ message: Messages.string('cpf') })
  @IsCPF({ message: Messages.document('cpf', 'cpf') })
  cpf: string;
}
