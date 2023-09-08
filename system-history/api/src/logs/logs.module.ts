import { Module } from '@nestjs/common';
import { LogsController } from './controller/logs.controller';
import { LogsService } from './services/logs.service';
import { CreateLogService } from './services/create-log/create-log.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LogsController],
  providers: [LogsService, CreateLogService],
})
export class LogsModule {}
