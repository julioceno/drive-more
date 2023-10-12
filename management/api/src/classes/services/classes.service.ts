import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './create-class/dto/create-class.dto';
import { CreateClassService } from './create-class/create-class.service';

@Injectable()
export class ClassesService {
  constructor(private readonly createClassService: CreateClassService) {}

  create(dto: CreateClassDto, creatorEmail: string) {
    return this.createClassService.run(dto, creatorEmail);
  }

  findAll() {
    return `This action returns all classes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
