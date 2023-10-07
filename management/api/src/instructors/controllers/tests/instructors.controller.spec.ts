import { Test, TestingModule } from '@nestjs/testing';
import { InstructorsController } from '../instructors.controller';
import { InstructorsService } from '@/instructors/services/instructors.service';
import { handleModuleDependencies } from '@/utils';
import { CreateInstructorDto } from '@/instructors/services/create-instructor/dto/create-instructor.dto';
import {
  mockCreateInstructorService,
  mockFindAllInstructorsService,
  mockUpdateInstructorService,
} from '@/utils/mocks/services/instructors';
import { UpdateInstructorDto } from '@/instructors/services/update-instructor/dto/update-instructor.dto';

describe('InstructorsController', () => {
  let controller: InstructorsController;

  const id = 'mock.id';
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

  afterEach(() => {
    jest.clearAllMocks();
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

  it('should invoke update method from InstructorsController', async () => {
    await controller.update(id, creatorEmail, {} as UpdateInstructorDto);
    expect(mockUpdateInstructorService.run).toHaveBeenLastCalledWith(
      id,
      creatorEmail,
      {},
    );
  });
});
