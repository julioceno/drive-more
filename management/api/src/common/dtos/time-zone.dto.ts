import { IsNotEmpty, IsString } from 'class-validator';
import { messages } from '../messages';

export abstract class TimeZoneDto {
  @IsNotEmpty({ message: messages.required('timeZone') })
  @IsString({ message: messages.string('timeZone') })
  timeZone: string;
}
