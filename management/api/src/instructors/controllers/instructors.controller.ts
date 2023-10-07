import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instructorsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @AuthorizedUser('email') creatorEmail: string,
    @Body() dto: CreateInstructorDto,
  ) {
    return this.instructorsService.update(id, creatorEmail, dto);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @AuthorizedUser('email') creatorEmail: string,
  ) {
    return this.instructorsService.delete(id, creatorEmail);
  }
}
