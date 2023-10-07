import { Test, TestingModule } from '@nestjs/testing';
import { InstructorsService } from '../instructors.service';
import { CreateInstructorDto } from '../create-instructor/dto/create-instructor.dto';
import {
  mockCreateInstructorService,
  mockDeleteInstructorService,
  mockFindAllInstructorsService,
  mockFindOneInstructorService,
  mockUpdateInstructorService,
} from '@/utils/mocks/services/instructors';
import { handleModuleDependencies } from '@/utils';
import { FindAllInstructorsDto } from '../find-all-instructors/dto/find-all-instructors.dto';
import { UpdateInstructorDto } from '../update-instructor/dto/update-instructor.dto';

describe('InstructorsService', () => {
  let service: InstructorsService;

  const id = 'mock.id';
  const creatorEmail = 'mock.creatorEmail';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstructorsService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<InstructorsService>(InstructorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke create method', async () => {
    await service.create(creatorEmail, {} as CreateInstructorDto);
    expect(mockCreateInstructorService.run).toHaveBeenLastCalledWith(
      creatorEmail,
      {},
    );
  });

  it('should invoke findAll method', async () => {
    await service.findAll({} as FindAllInstructorsDto);
    expect(mockFindAllInstructorsService.run).toHaveBeenLastCalledWith({});
  });

  it('should invoke update method', async () => {
    await service.update(id, creatorEmail, {} as UpdateInstructorDto);
    expect(mockUpdateInstructorService.run).toHaveBeenLastCalledWith(
      id,
      creatorEmail,
      {},
    );
  });

  it('should invoke delete method', async () => {
    await service.delete(id, creatorEmail);
    expect(mockDeleteInstructorService.run).toHaveBeenLastCalledWith(
      id,
      creatorEmail,
    );
  });

  it('should invoke findOne method', async () => {
    await service.findOne(id);
    expect(mockFindOneInstructorService.run).toHaveBeenLastCalledWith(id);
  });
});
