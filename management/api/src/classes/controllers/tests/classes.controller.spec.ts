import { Test, TestingModule } from '@nestjs/testing';
import { ClassesController } from '../classes.controller';
import { ClassesService } from '../../services/classes.service';
import { handleModuleDependencies, mockCreateClassService } from '@/utils';
import { Class } from '@prisma/client';

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
});
