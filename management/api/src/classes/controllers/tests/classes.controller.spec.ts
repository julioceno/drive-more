import { Test, TestingModule } from '@nestjs/testing';
import { ClassesController } from '../classes.controller';
import { ClassesService } from '../../services/classes.service';
import { handleModuleDependencies } from '@/utils';

describe('ClassesController', () => {
  let controller: ClassesController;

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
