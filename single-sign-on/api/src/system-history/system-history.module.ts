import { Module } from '@nestjs/common';
import { systemHistoryConfigs } from '@/grpc/system-history/system-history-client.config';
import { CreateRecordService } from './services/create-record/create-record.service';
import { SystemHistoryProxyService } from './services/system-history-proxy/system-history-proxy.service';
import { FindEntityDatabaseService } from './services/find-entity-database/find-entity-database.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  exports: [CreateRecordService, SystemHistoryProxyService],
  imports: [systemHistoryConfigs(), PrismaModule],
  providers: [
    CreateRecordService,
    SystemHistoryProxyService,
    FindEntityDatabaseService,
  ],
})
export class SystemHistoryModule {}
