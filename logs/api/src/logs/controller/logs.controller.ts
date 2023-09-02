import { Body, Controller, Post } from '@nestjs/common';
import { CreateLogDto } from '../services/create-log/dto/create-log.dto';
import { LogsService } from '../services/logs.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  @GrpcMethod('SystemHistoryService', 'Create')
  create(@Body() createLogDto: CreateLogDto) {
    return this.logsService.create(createLogDto);
  }
}
