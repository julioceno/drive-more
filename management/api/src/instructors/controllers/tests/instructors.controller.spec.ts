import { Test, TestingModule } from '@nestjs/testing';
import { InstructorsController } from '../instructors.controller';
import { InstructorsService } from '@/instructors/services/instructors.service';
import { handleModuleDependencies } from '@/utils';
import { CreateInstructorDto } from '@/instructors/services/create-instructor/dto/create-instructor.dto';
import {
  mockCreateInstructorService,
  mockFindAllInstructorsService,
} from '@/utils/mocks/services/instructors';

describe('InstructorsController', () => {
  let controller: InstructorsController;

  const creatorEmail = 'mock.creatorEmail';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstructorsController],
      providers: [InstructorsService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    controller = module.get<InstructorsController>(InstructorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should invoke create method from InstructorsController', async () => {
    await controller.create(creatorEmail, {} as CreateInstructorDto);
    expect(mockCreateInstructorService.run).toHaveBeenLastCalledWith(
      creatorEmail,
      {},
    );
  });

  it('should invoke findAll method from InstructorsController', async () => {
    await controller.findAll({});
    expect(mockFindAllInstructorsService.run).toHaveBeenLastCalledWith({});
  });
});
