import { Injectable } from '@nestjs/common';
import { CreateStudentService } from './create-student/create-student.service';
import { CreateStudentDto } from './create-student/dto/create-student.dto';
import { FindAllStudentsService } from './find-all-students/find-all-students.service';
import { FindAllStudentsDto } from './find-all-students/dto/find-all-students.dto';
import { UpdateStudentDto } from './update-student/dto/update-student.dto';
import { UpdateStudentService } from './update-student/update-student.service';
import { DeleteStudentService } from './delete-student/delete-student.service';
import { FindOneStudentService } from './find-one-student/find-one-student.service';

@Injectable()
export class StudentsService {
  constructor(
    private readonly createStudentService: CreateStudentService,
    private readonly findAllStudentsService: FindAllStudentsService,
    private readonly updateStudentService: UpdateStudentService,
    private readonly deleteStudentService: DeleteStudentService,
    private readonly findOneStudentService: FindOneStudentService,
  ) {}

  create(creatorEmail: string, dto: CreateStudentDto) {
    return this.createStudentService.run(creatorEmail, dto);
  }

  findAll(dto: FindAllStudentsDto) {
    return this.findAllStudentsService.run(dto);
  }

  findOne(id: string) {
    return this.findOneStudentService.run(id);
  }

  update(id: string, creatorEmail: string, dto: UpdateStudentDto) {
    return this.updateStudentService.run(id, creatorEmail, dto);
  }

  delete(id: string, creatorEmail: string) {
    return this.deleteStudentService.run(id, creatorEmail);
  }
}
