import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Messages } from 'dirigir-more-utils';

export class CreateUserDto {
  @IsNotEmpty({ message: Messages.required('name') })
  @IsString({ message: Messages.string('name') })
  name: string;

  @IsNotEmpty({ message: Messages.required('email') })
  @IsString({ message: Messages.string('email') })
  @IsEmail({}, { message: Messages.email('email') })
  email: string;
}
