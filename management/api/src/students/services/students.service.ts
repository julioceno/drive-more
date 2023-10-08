import { Injectable } from '@nestjs/common';
import { CreateStudentService } from './create-student/create-student.service';
import { CreateStudentDto } from './create-student/dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly createStudentService: CreateStudentService) {}

  create(creatorEmail: string, dto: CreateStudentDto) {
    return this.createStudentService.run(creatorEmail, dto);
  }

  findAll() {
    return `This action returns all students`;
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
