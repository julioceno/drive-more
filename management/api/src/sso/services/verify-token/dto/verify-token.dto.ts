import { IsNotEmpty, IsString } from 'class-validator';
import { messages } from '@/common';

export class VerifyTokenDto {
  @IsNotEmpty({ message: messages.required('token') })
  @IsString({ message: messages.string('token') })
  token: string;
}
