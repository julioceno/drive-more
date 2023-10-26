import { TimeZoneDto, messages } from '@/common';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GeneratePdfDto extends TimeZoneDto {
  @IsNotEmpty({ message: messages.string('studentId') })
  @IsUUID('4', { message: messages.uuid('studentId') })
  studentId: string;

  timeZone: string;
}
