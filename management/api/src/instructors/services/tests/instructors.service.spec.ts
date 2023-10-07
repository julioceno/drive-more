import { Test, TestingModule } from '@nestjs/testing';
import { InstructorsService } from '../instructors.service';
import { CreateInstructorDto } from '../create-instructor/dto/create-instructor.dto';
import {
  mockCreateInstructorService,
  mockFindAllInstructorsService,
} from '@/utils/mocks/services/instructors';
import { handleModuleDependencies } from '@/utils';
import { FindAllInstructorsDto } from '../find-all-instructors/dto/find-all-instructors.dto';

describe('InstructorsService', () => {
  let service: InstructorsService;

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
});
