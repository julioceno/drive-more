import { Body, Controller, Post } from '@nestjs/common';
import { CreateRecordDto } from '../services/create-record/dto/create-record.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { RecordsService } from '../services/records.service';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @GrpcMethod('SystemHistoryService', 'Create')
  create(@Body() createLogDto: CreateRecordDto) {
    return this.recordsService.create(createLogDto);
  }
}
