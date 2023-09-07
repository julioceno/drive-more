import { CreateRecordService } from '@/system-history/services/create-record/create-record.service';
import { FindEntityDatabaseService } from '@/system-history/services/find-entity-database/find-entity-database.service';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';

export const mockSystemHistorService = {
  createRecordStandard: jest.fn().mockResolvedValue({}),
  createRecordCustom: jest.fn().mockResolvedValue({}),
};

export const mockCreateRecordService = {
  run: jest.fn(),
};

export const mockFindEntityDatabaseService = {
  run: jest.fn(),
};

export const systemHistoryMocks = [
  {
    provide: SystemHistoryProxyService,
    useValue: mockSystemHistorService,
  },
  {
    provide: CreateRecordService,
    useValue: mockCreateRecordService,
  },
  {
    provide: FindEntityDatabaseService,
    useValue: mockFindEntityDatabaseService,
  },
];
