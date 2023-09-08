import { Test, TestingModule } from '@nestjs/testing';
import { RecordsController } from '../records.controller';
import { LogsService } from '@/logs/services/logs.service';

describe('LogsController', () => {
  let controller: RecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordsController],
      providers: [LogsService],
    }).compile();

    controller = module.get<RecordsController>(RecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
