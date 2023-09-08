import { Module } from '@nestjs/common';
import { RecordsController } from './controller/records.controller';
import { CreateRecordService } from './services/create-record/create-record.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { RecordsService } from './services/records.service';

@Module({
  imports: [PrismaModule],
  controllers: [RecordsController],
  providers: [RecordsService, CreateRecordService],
})
export class RecordsModule {}
