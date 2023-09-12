import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRecordDto } from '../services/create-record/dto/create-record.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { RecordsService } from '../services/records.service';
import { FindAllDiffsRecordsDto } from '../services/find-all-diffs-records/dto/find-all-diffs-records.dto';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @GrpcMethod('SystemHistoryService', 'Create')
  create(@Body() dto: CreateRecordDto) {
    return this.recordsService.create(dto);
  }

  @Get('/diffs')
  findAllDiffs(@Body() dto: FindAllDiffsRecordsDto) {
    return this.recordsService.findAllDiffs(dto);
  }
}
