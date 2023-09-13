import { Test, TestingModule } from '@nestjs/testing';
import { handleModuleDependencies } from '@/utils';
import { RecordsService } from '../records.service';
import { CreateRecordDto } from '../create-record/dto/create-record.dto';
import { Action } from '@prisma/client';
import {
  mockCreateRecordService,
  mockFindAllDiffsRecordsService,
} from '@/utils/mocks/services/records';
import { FindAllDiffsRecordsDto } from '../find-all-diffs-records/dto/find-all-diffs-records.dto';

describe('RecordsService', () => {
  let service: RecordsService;

  const dto: CreateRecordDto = {
    action: Action.CREATE,
    creatorEmail: 'mock.creatorEmail',
    entityId: '1',
    moduleName: 'mock.moduleName',
    resourceName: 'mock.resourceName',
    payload: 'mock.payload',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordsService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<RecordsService>(RecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke create method', async () => {
    await service.create(dto);
    expect(mockCreateRecordService.run).toHaveBeenCalledWith(dto);
  });

  it('should invoke findAllDiffs method', async () => {
    const dto = {} as FindAllDiffsRecordsDto;
    await service.findAllDiffs(dto);
    expect(mockFindAllDiffsRecordsService.run).toHaveBeenCalledWith(dto);
  });
});
