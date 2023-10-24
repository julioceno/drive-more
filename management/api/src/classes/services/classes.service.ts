import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './create-class/dto/create-class.dto';
import { CreateClassService } from './create-class/create-class.service';
import { FindAllClassesService } from './find-all-classes/find-all-classes.service';
import { FindAllClassesDto } from './find-all-classes/dto/find-all-classes.dto';
import { FindOneClassService } from './find-one-class/find-one-class.service';
import { DeleteClassService } from './delete-class/delete-class.service';
import { GeneratePdfService } from './generate-pdf/generate-pdf.service';
import { GeneratePdfDto } from './generate-pdf/dto/generate-pdf.dto';

@Injectable()
export class ClassesService {
  constructor(
    private readonly createClassService: CreateClassService,
    private readonly findAllClassesService: FindAllClassesService,
    private readonly findOneClassService: FindOneClassService,
    private readonly deleteClassService: DeleteClassService,
    private readonly generatePdfService: GeneratePdfService,
  ) {}

  create(creatorEmail: string, dto: CreateClassDto) {
    return this.createClassService.run(creatorEmail, dto);
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

  generatePdf(creatorEmail: string, dto: GeneratePdfDto) {
    return this.generatePdfService.run(creatorEmail, dto);
  }
}
