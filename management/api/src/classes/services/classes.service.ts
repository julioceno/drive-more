import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './create-class/dto/create-class.dto';
import { CreateClassService } from './create-class/create-class.service';
import { FindAllClassesService } from './find-all-classes/find-all-classes.service';
import { FindAllClassesDto } from './find-all-classes/dto/find-all-classes.dto';
import { FindOneClassService } from './find-one-class/find-one-class.service';
import { DeleteClassService } from './delete-class/delete-class.service';

@Injectable()
export class ClassesService {
  constructor(
    private readonly createClassService: CreateClassService,
    private readonly findAllClassesService: FindAllClassesService,
    private readonly findOneClassService: FindOneClassService,
    private readonly deleteClassService: DeleteClassService,
  ) {}

  create(dto: CreateClassDto, creatorEmail: string) {
    return this.createClassService.run(dto, creatorEmail);
  }

  findAll(dto: FindAllClassesDto) {
    return this.findAllClassesService.run(dto);
  }

  findOne(id: string) {
    return this.findOneClassService.run(id);
  }

  delete(id: string, creatorEmail: string) {
    return this.deleteClassService.run(id, creatorEmail);
  }
}
