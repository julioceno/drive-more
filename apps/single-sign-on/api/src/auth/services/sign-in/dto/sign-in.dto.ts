import { IsEmail, IsNotEmpty } from 'class-validator';
import { Messages } from 'src/common';

export class SignInDto {
  @IsNotEmpty({ message: Messages.required('email') })
  @IsEmail({}, { message: Messages.email('email') })
  email: string;

  @IsNotEmpty({ message: Messages.required('password') })
  @IsNotEmpty({ message: Messages.required('password') })
  password: string;
}
