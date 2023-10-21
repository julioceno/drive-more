import { Test, TestingModule } from '@nestjs/testing';
import { RecordsController } from '../records.controller';
import { RecordsService } from '@/records/services/records.service';
import { CreateRecordDto } from '@/records/services/create-record/dto/create-record.dto';
import { Action } from '@prisma/client';
import {
  mockCreateRecordService,
  mockFindAllDiffsRecordsService,
} from '@/utils/mocks/services/records';
import { handleModuleDependencies } from '@/utils';

describe('RecordsController', () => {
  let controller: RecordsController;

  const dto: CreateRecordDto = {
    action: Action.CREATE,
    creatorEmail: 'mock.creatorEmail',
    entityId: 'mock.entityId',
    moduleName: 'mock.moduleName',
    payload: 'mock.payload',
    resourceName: 'mock.resourceName',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordsController],
      providers: [RecordsService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    controller = module.get<RecordsController>(RecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should invoke create method from RecordsController', async () => {
    await controller.create(dto);
    expect(mockCreateRecordService.run).toHaveBeenLastCalledWith(dto);
  });
  it('should invoke findAllDiffs method from RecordsController', async () => {
    await controller.findAllDiffs(dto);
    expect(mockFindAllDiffsRecordsService.run).toHaveBeenLastCalledWith(dto);
  });
});
