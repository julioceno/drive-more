import { IsCPF, messages } from '@/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty({ message: messages.required('name') })
  @IsString({ message: messages.string('name') })
  name: string;

  @IsNotEmpty({ message: messages.required('cpf') })
  @IsString({ message: messages.string('cpf') })
  @IsCPF({ message: messages.document('cpf', 'cpf') })
  cpf: string;
}
