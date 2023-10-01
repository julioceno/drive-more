import { Injectable } from '@nestjs/common';
import { CreateInstructorService } from './create-instructor/create-instructor.service';
import { CreateInstructorDto } from './create-instructor/dto/create-instructor.dto';

@Injectable()
export class InstructorsService {
  constructor(
    private readonly createInstructorService: CreateInstructorService,
  ) {}

  create(creatorEmail: string, dto: CreateInstructorDto) {
    return this.createInstructorService.run(creatorEmail, dto);
  }
}
