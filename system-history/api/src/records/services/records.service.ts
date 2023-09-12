import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './create-record/dto/create-record.dto';
import { CreateRecordService } from './create-record/create-record.service';
import { FindAllDiffsRecordsDto } from './find-all-diffs-records/dto/find-all-diffs-records.dto';
import { FindAllDiffsRecordsService } from './find-all-diffs-records/find-all-diffs-records.service';

@Injectable()
export class RecordsService {
  constructor(
    private readonly createLogService: CreateRecordService,
    private readonly findAllDiffsRecordsService: FindAllDiffsRecordsService,
  ) {}

  create(dto: CreateRecordDto) {
    return this.createLogService.run(dto);
  }

  findAllDiffs(dto: FindAllDiffsRecordsDto) {
    return this.findAllDiffsRecordsService.run(dto);
  }
}
