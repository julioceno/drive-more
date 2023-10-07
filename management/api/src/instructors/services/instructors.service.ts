import { Injectable } from '@nestjs/common';
import { CreateInstructorService } from './create-instructor/create-instructor.service';
import { CreateInstructorDto } from './create-instructor/dto/create-instructor.dto';
import { FindAllInstructorsDto } from './find-all-instructors/dto/find-all-instructors.dto';
import { FindAllInstructorsService } from './find-all-instructors/find-all-instructors.service';
import { UpdateInstructorService } from './update-instructor/update-instructor.service';
import { UpdateInstructorDto } from './update-instructor/dto/update-instructor.dto';

@Injectable()
export class InstructorsService {
  constructor(
    private readonly createInstructorService: CreateInstructorService,
    private readonly findAllInstructorsService: FindAllInstructorsService,
    private readonly updateInstructorService: UpdateInstructorService,
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
}
