import { Messages } from '@/common';
import { Action, Prisma } from '@prisma/client';
import { IsEnum, IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class CreateLogDto {
  @IsNotEmpty({ message: Messages.required('creatorEmail') })
  @IsString({ message: Messages.string('creatorEmail') })
  creatorEmail: string;

  @IsNotEmpty({ message: Messages.required('action') })
  @IsEnum(Action, { message: Messages.enum('action', Action) })
  action: Action;

  @IsNotEmpty({ message: Messages.required('payload') })
  @IsString({ message: Messages.string('payload') })
  payload: string;

  @IsNotEmpty({ message: Messages.required('entityId') })
  @IsString({ message: Messages.string('entityId') })
  entityId: string;

  @IsNotEmpty({ message: Messages.required('moduleName') })
  @IsString({ message: Messages.string('moduleName') })
  moduleName: string;

  @IsNotEmpty({ message: Messages.required('resourceName') })
  @IsString({ message: Messages.string('resourceName') })
  resourceName: string;
}
