import { messages } from '@/common';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GeneratePdfDto {
  @IsNotEmpty({ message: messages.string('studentId') })
  @IsUUID('4', { message: messages.uuid('studentId') })
  studentId: string;
}
