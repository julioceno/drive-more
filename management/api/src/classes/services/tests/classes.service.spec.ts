import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from '../classes.service';
import {
  handleModuleDependencies,
  mockCreateClassService,
  mockDeleteClassService,
  mockFindAllClassesService,
  mockFindOneClassService,
} from '@/utils';
import { CreateClassDto } from '../create-class/dto/create-class.dto';
import { FindAllClassesDto } from '../find-all-classes/dto/find-all-classes.dto';

describe('ClassesService', () => {
  let service: ClassesService;

  const id = 'mock.id';
  const creatorEmail = 'mock.creatorEmail';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassesService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<ClassesService>(ClassesService);
  });

  afterEach(() => jest.clearAllMocks());

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

  it('should invoke findAll method', async () => {
    await service.findAll({} as FindAllClassesDto);
    expect(mockFindAllClassesService.run).toHaveBeenLastCalledWith({});
  });

  it('should invoke findOne method', async () => {
    await service.findOne(id);
    expect(mockFindOneClassService.run).toHaveBeenLastCalledWith(id);
  });

  it('should invoke delete method', async () => {
    await service.delete(id, creatorEmail);
    expect(mockDeleteClassService.run).toHaveBeenLastCalledWith(
      id,
      creatorEmail,
    );
  });
});
