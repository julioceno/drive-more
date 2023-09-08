import { IServiceMock } from '@/common';
import { CreateRecordService } from '@/records/services/create-record/create-record.service';

export const mockCreateRecordService = {
  run: jest.fn(),
};

export const records: IServiceMock[] = [
  {
    provide: CreateRecordService,
    useValue: mockCreateRecordService,
  },
];
