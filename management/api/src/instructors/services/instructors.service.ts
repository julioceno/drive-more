import { Injectable } from '@nestjs/common';
import { CreateInstructorDto } from '../dto/create-instructor.dto';

@Injectable()
export class InstructorsService {
  create(dto: CreateInstructorDto) {
    return 'This action adds a new instructor';
  }
}
