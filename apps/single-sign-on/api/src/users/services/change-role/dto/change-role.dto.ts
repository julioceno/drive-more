import { Messages } from '@/common';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Role } from '../utils/roles';

export class ChangeRoleDto {
  @IsNotEmpty({ message: Messages.required('role') })
  @IsEnum(Role, { message: Messages.enum('role') })
  role: Role;

  @IsNotEmpty({ message: Messages.required('userId') })
  @IsUUID('4', { message: Messages.uuid('userId') })
  userId: string;
}
