import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { StudentsService } from '../services/students.service';
import { AuthorizedUser } from '@/common';
import { CreateStudentDto } from '../services/create-student/dto/create-student.dto';
import { FindAllStudentsDto } from '../services/find-all-students/dto/find-all-students.dto';
import { UpdateStudentDto } from '../services/update-student/dto/update-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(
    @AuthorizedUser('email') creatorEmail: string,
    @Body() dto: CreateStudentDto,
  ) {
    return this.studentsService.create(creatorEmail, dto);
  }

  @Get()
  findAll(@Query() dto: FindAllStudentsDto) {
    return this.studentsService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @AuthorizedUser('email') creatorEmail: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, creatorEmail, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
