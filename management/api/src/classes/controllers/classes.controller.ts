import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ClassesService } from '../services/classes.service';
import { CreateClassDto } from '../services/create-class/dto/create-class.dto';
import { AuthorizedUser } from '@/common';
import { FindAllClassesDto } from '../services/find-all-classes/dto/find-all-classes.dto';
import { GeneratePdfDto } from '../services/generate-pdf/dto/generate-pdf.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@AuthorizedUser('email') creatorEmail, @Body() dto: CreateClassDto) {
    return this.classesService.create(creatorEmail, dto);
  }

  @Get()
  findAll(@Query() dto: FindAllClassesDto) {
    return this.classesService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @AuthorizedUser('email') creatorEmail) {
    return this.classesService.delete(id, creatorEmail);
  }

  @Post('/generate-pdf')
  generatePdf(
    @AuthorizedUser('email') creatorEmail,
    @Body() dto: GeneratePdfDto,
  ) {
    return this.classesService.generatePdf(creatorEmail, dto);
  }
}
