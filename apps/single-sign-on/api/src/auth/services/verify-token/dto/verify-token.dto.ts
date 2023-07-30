import { Messages } from '@/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyTokenDto {
  @IsNotEmpty({ message: Messages.required('token') })
  @IsString({ message: Messages.string('token') })
  token: string;
}
