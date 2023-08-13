import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Messages } from '@/common';

export class SignInDto {
  @IsNotEmpty({ message: Messages.required('email') })
  @IsEmail({}, { message: Messages.email('email') })
  email: string;

  @IsNotEmpty({ message: Messages.required('password') })
  @IsString({ message: Messages.required('password') })
  password: string;

  @IsNotEmpty({ message: Messages.required('clientId') })
  @IsUUID(4, { message: Messages.uuid('clientId') })
  clientId: string;
}
