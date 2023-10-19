import { messages } from '@/common';
import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

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
  @IsDateString({}, { message: messages.date('startAt') })
  startAt: string;

  @IsNotEmpty({ message: messages.string('endAt') })
  @IsDateString({}, { message: messages.date('endAt') })
  endAt: string;
}
