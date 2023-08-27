import { Module } from '@nestjs/common';
import { LogsController } from './controller/logs.controller';
import { LogsService } from './services/logs.service';

@Module({
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
