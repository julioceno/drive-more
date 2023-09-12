import { Module } from '@nestjs/common';
import { RecordsController } from './controller/records.controller';
import { CreateRecordService } from './services/create-record/create-record.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { RecordsService } from './services/records.service';
import { FindAllDiffsRecordsService } from './services/find-all-diffs-records/find-all-diffs-records.service';

@Module({
  imports: [PrismaModule],
  controllers: [RecordsController],
  providers: [RecordsService, CreateRecordService, FindAllDiffsRecordsService],
})
export class RecordsModule {}
