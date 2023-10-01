import { Body, Controller, Post } from '@nestjs/common';
import { InstructorsService } from '../services/instructors.service';
import { CreateInstructorDto } from '../services/create-instructor/dto/create-instructor.dto';
import { AuthorizedUser } from '@/common';

@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Post()
  create(@AuthorizedUser() user: string, @Body() dto: CreateInstructorDto) {
    return this.instructorsService.create('julio', dto);
  }
}
