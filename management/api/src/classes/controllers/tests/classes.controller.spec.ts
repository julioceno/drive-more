import { Test, TestingModule } from '@nestjs/testing';
import { ClassesController } from '../classes.controller';
import { ClassesService } from '../../services/classes.service';
import {
  handleModuleDependencies,
  mockCreateClassService,
  mockDeleteClassService,
  mockFindAllClassesService,
  mockFindOneClassService,
} from '@/utils';
import { Class } from '@prisma/client';
import { FindAllClassesDto } from '@/classes/services/find-all-classes/dto/find-all-classes.dto';

describe('ClassesController', () => {
  let controller: ClassesController;

  const id = 'mock.id';
  const creatorEmail = 'mock.creatorEmail';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassesController],
      providers: [ClassesService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    controller = module.get<ClassesController>(ClassesController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should invoke create method from ClassesController', async () => {
    await controller.create(creatorEmail, {} as Class);
    expect(mockCreateClassService.run).toHaveBeenLastCalledWith(
      creatorEmail,
      {},
    );
  });

  it('should invoke findAll method from ClassesController', async () => {
    await controller.findAll({} as FindAllClassesDto);
    expect(mockFindAllClassesService.run).toHaveBeenLastCalledWith({});
  });

  it('should invoke findOne method from ClassesController', async () => {
    await controller.findOne(id);
    expect(mockFindOneClassService.run).toHaveBeenLastCalledWith(id);
  });

  it('should invoke delete method from ClassesController', async () => {
    await controller.delete(id, creatorEmail);
    expect(mockDeleteClassService.run).toHaveBeenLastCalledWith(
      id,
      creatorEmail,
    );
  });
});
