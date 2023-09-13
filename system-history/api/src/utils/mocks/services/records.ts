import { IServiceMock } from '@/common';
import { CreateRecordService } from '@/records/services/create-record/create-record.service';
import { FindAllDiffsRecordsService } from '@/records/services/find-all-diffs-records/find-all-diffs-records.service';

export const mockCreateRecordService = {
  run: jest.fn(),
};

export const mockFindAllDiffsRecordsService = {
  run: jest.fn(),
};

export const records: IServiceMock[] = [
  {
    provide: CreateRecordService,
    useValue: mockCreateRecordService,
  },
  {
    provide: FindAllDiffsRecordsService,
    useValue: mockFindAllDiffsRecordsService,
  },
];
