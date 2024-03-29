import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Messages, RoleEnum } from '@/common';

export class ChangeRoleUserDto {
  @IsNotEmpty({ message: Messages.required('role') })
  @IsEnum(RoleEnum, { message: Messages.enum('role', RoleEnum) })
  role: RoleEnum;

  @IsNotEmpty({ message: Messages.required('userId') })
  @IsUUID('4', { message: Messages.uuid('userId') })
  userId: string;
}
