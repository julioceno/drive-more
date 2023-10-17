import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from '../classes.service';
import { handleModuleDependencies, mockCreateClassService } from '@/utils';
import { CreateClassDto } from '../create-class/dto/create-class.dto';

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

  it('should invoke create method', async () => {
    await service.create(creatorEmail, {} as CreateClassDto);
    expect(mockCreateClassService.run).toHaveBeenLastCalledWith(
      creatorEmail,
      {},
    );
  });
});
