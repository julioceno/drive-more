import { handleModuleDependencies } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateClassService } from '../create-class.service';

describe('CreateClassService', () => {
  let service: CreateClassService;

  const creatorEmail = 'mock.creatorEmail';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateClassService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<CreateClassService>(CreateClassService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
