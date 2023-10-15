import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from '../classes.service';
import { handleModuleDependencies } from '@/utils';

describe('ClassesService', () => {
  let service: ClassesService;

  const creatorEmail = 'mock.creatorEmail';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassesService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<ClassesService>(ClassesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
