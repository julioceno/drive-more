import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecordService } from '../create-record.service';

// TODO: create this test
describe('CreateRecordService', () => {
  let service: CreateRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateRecordService],
    }).compile();

    service = module.get<CreateRecordService>(CreateRecordService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
