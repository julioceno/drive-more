import { Test, TestingModule } from '@nestjs/testing';
import { SystemHistoryService } from '../system-history.service';

describe('SystemHistoryService', () => {
  let service: SystemHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemHistoryService],
    }).compile();

    service = module.get<SystemHistoryService>(SystemHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
