import { Module } from '@nestjs/common';
import { SystemHistoryService } from './services/system-history.service';
import { systemHistoryConfigs } from '@/grpc/system-history/system-history-client.config';
import { CreateRecordService } from './services/create-record/create-record.service';
import { SystemHistoryProxyService } from './services/system-history-proxy/system-history-proxy.service';
import { FindEntityDatabaseService } from './services/find-entity-database/find-entity-database.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  exports: [CreateRecordService, SystemHistoryProxyService],
  imports: [systemHistoryConfigs()],
  providers: [
    SystemHistoryService,
    CreateRecordService,
    SystemHistoryProxyService,
    FindEntityDatabaseService,
    PrismaService,
  ],
})
export class SystemHistoryModule {}
