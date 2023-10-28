import { AuthorizedUser } from '@/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ClassesService } from '../services/classes.service';
import { CreateClassDto } from '../services/create-class/dto/create-class.dto';
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
    @Req() req: Request,
  ) {
    return this.classesService.generatePdf(creatorEmail, dto, req);
  }
}
