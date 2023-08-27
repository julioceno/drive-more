import { Body, Controller, Post } from '@nestjs/common';
import { CreateLogDto } from '../services/create-log/dto/create-log.dto';
import { LogsService } from '../services/logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  create(@Body() createLogDto: CreateLogDto) {
    return this.logsService.create(createLogDto);
  }
}
