import { Test, TestingModule } from '@nestjs/testing';
import { handleModuleDependencies } from '@/utils';
import { FindAllDiffsRecordsService } from '../find-all-diffs-records.service';

describe('FindAllDiffsRecordsService', () => {
  let service: FindAllDiffsRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllDiffsRecordsService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<FindAllDiffsRecordsService>(
      FindAllDiffsRecordsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
