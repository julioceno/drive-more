import { Body, Controller, Post } from '@nestjs/common';
import { CreateInstructorDto } from '../dto/create-instructor.dto';
import { InstructorsService } from '../services/instructors.service';

@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Post()
  create(@Body() dto: CreateInstructorDto) {
    return this.instructorsService.create(dto);
  }
}
