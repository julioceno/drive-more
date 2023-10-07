import { Injectable } from '@nestjs/common';
import { CreateInstructorService } from './create-instructor/create-instructor.service';
import { CreateInstructorDto } from './create-instructor/dto/create-instructor.dto';
import { FindAllInstructorsDto } from './find-all-instructors/dto/find-all-instructors.dto';
import { FindAllInstructorsService } from './find-all-instructors/find-all-instructors.service';
import { UpdateInstructorService } from './update-instructor/update-instructor.service';
import { UpdateInstructorDto } from './update-instructor/dto/update-instructor.dto';
import { DeleteInstructorService } from './delete-instructor/delete-instructor.service';

@Injectable()
export class InstructorsService {
  constructor(
    private readonly createInstructorService: CreateInstructorService,
    private readonly findAllInstructorsService: FindAllInstructorsService,
    private readonly updateInstructorService: UpdateInstructorService,
    private readonly deleteInstructorService: DeleteInstructorService,
  ) {}

  create(creatorEmail: string, dto: CreateInstructorDto) {
    return this.createInstructorService.run(creatorEmail, dto);
  }

  findAll(dto: FindAllInstructorsDto) {
    return this.findAllInstructorsService.run(dto);
  }

  update(id: string, creatorEmail: string, dto: UpdateInstructorDto) {
    return this.updateInstructorService.run(id, creatorEmail, dto);
  }

  delete(id: string, creatorEmail: string) {
    return this.deleteInstructorService.run(id, creatorEmail);
  }
}
