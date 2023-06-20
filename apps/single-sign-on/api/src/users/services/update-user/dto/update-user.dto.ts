import { Messages } from '@/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: Messages.required('name') })
  @IsString({ message: Messages.string('name') })
  name: string;

  @IsNotEmpty({ message: Messages.required('email') })
  @IsString({ message: Messages.string('email') })
  @IsEmail({}, { message: Messages.email('email') })
  email: string;

  @IsNotEmpty({ message: Messages.required('password') })
  @IsString({ message: Messages.string('password') })
  password: string;
}
