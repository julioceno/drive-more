import { Messages, RoleEnum } from '@/common';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class ChangeRoleDto {
  @IsNotEmpty({ message: Messages.required('role') })
  @IsEnum(RoleEnum, { message: Messages.enum('role') })
  role: RoleEnum;

  @IsNotEmpty({ message: Messages.required('userId') })
  @IsUUID('4', { message: Messages.uuid('userId') })
  userId: string;
}
