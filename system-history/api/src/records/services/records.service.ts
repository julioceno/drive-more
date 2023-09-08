import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './create-record/dto/create-record.dto';
import { CreateRecordService } from './create-record/create-record.service';

@Injectable()
export class RecordsService {
  constructor(private readonly createLogService: CreateRecordService) {}

  create(dto: CreateRecordDto) {
    return this.createLogService.run(dto);
  }
}
