import { IsNotEmpty, IsString } from 'class-validator';
import { Messages } from '@/common';

export class VerifyTokenDto {
  @IsNotEmpty({ message: Messages.required('token') })
  @IsString({ message: Messages.string('token') })
  token: string;
}
