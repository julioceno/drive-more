import { messages } from '@/common';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty({ message: messages.string('studentId') })
  @IsUUID('4', { message: messages.uuid('studentId') })
  studentId: string;

  @IsNotEmpty({ message: messages.string('instructorId') })
  @IsUUID('4', { message: messages.uuid('instructorId') })
  instructorId: string;

  @IsNotEmpty({ message: messages.string('categoryId') })
  @IsUUID('4', { message: messages.uuid('categoryId') })
  categoryId: string;

  @IsNotEmpty({ message: messages.string('startAt') })
  @IsDate({ message: messages.date('startAt') })
  @Type(() => Date)
  startAt: Date;

  @IsNotEmpty({ message: messages.string('endAt') })
  @IsDate({ message: messages.date('endAt') })
  @Type(() => Date)
  endAt: Date;
}
