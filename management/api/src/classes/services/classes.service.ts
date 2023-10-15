import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './create-class/dto/create-class.dto';
import { CreateClassService } from './create-class/create-class.service';
import { FindAllClassesService } from './find-all-classes/find-all-classes.service';
import { FindAllClassesDto } from './find-all-classes/dto/find-all-classes.dto';

@Injectable()
export class ClassesService {
  constructor(
    private readonly createClassService: CreateClassService,
    private readonly findAllClassesService: FindAllClassesService,
  ) {}

  create(dto: CreateClassDto, creatorEmail: string) {
    return this.createClassService.run(dto, creatorEmail);
  }

  findAll(dto: FindAllClassesDto) {
    return this.findAllClassesService.run(dto);
  }

  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
