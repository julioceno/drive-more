import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InstructorsService } from '../services/instructors.service';
import { CreateInstructorDto } from '../services/create-instructor/dto/create-instructor.dto';
import { AuthorizedUser } from '@/common';
import { FindAllInstructorsDto } from '../services/find-all-instructors/dto/find-all-instructors.dto';

@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Post()
  create(
    @AuthorizedUser('email') creatorEmail: string,
    @Body() dto: CreateInstructorDto,
  ) {
    return this.instructorsService.create(creatorEmail, dto);
  }

  @Get()
  findAll(@Query() dto: FindAllInstructorsDto) {
    return this.instructorsService.findAll(dto);
  }
}
