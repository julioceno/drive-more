import { Injectable } from '@nestjs/common';
import { CreateRecordService } from './create-record/create-record.service';
import { ICreateRecordParams } from '../interface/system-history.interface';

@Injectable()
export class SystemHistoryService {
  constructor(private readonly createRecordService: CreateRecordService) {}

  createHistoryRecord(data: ICreateRecordParams) {
    return this.createRecordService.run(data);
  }
}
