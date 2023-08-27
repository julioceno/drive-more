import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './create-log/dto/create-log.dto';
import { CreateLogService } from './create-log/create-log.service';

@Injectable()
export class LogsService {
  constructor(private readonly createLogService: CreateLogService) {}

  create(dto: CreateLogDto) {
    return this.createLogService.run(dto);
  }
}
