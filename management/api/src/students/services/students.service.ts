import { Injectable } from '@nestjs/common';
import { CreateStudentService } from './create-student/create-student.service';
import { CreateStudentDto } from './create-student/dto/create-student.dto';
import { FindAllStudentsService } from './find-all-students/find-all-students.service';
import { FindAllStudentsDto } from './find-all-students/dto/find-all-students.dto';

@Injectable()
export class StudentsService {
  constructor(
    private readonly createStudentService: CreateStudentService,
    private readonly findAllStudentsService: FindAllStudentsService,
  ) {}

  create(creatorEmail: string, dto: CreateStudentDto) {
    return this.createStudentService.run(creatorEmail, dto);
  }

  findAll(dto: FindAllStudentsDto) {
    return this.findAllStudentsService.run(dto);
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: CreateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
