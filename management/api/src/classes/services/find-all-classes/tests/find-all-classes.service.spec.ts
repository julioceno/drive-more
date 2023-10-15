import { handleModuleDependencies } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { FindAllClassesService } from '../find-all-classes.service';

describe('FindAllClassesService', () => {
  let service: FindAllClassesService;

  const creatorEmail = 'mock.creatorEmail';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllClassesService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<FindAllClassesService>(FindAllClassesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
