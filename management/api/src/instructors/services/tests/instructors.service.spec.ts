import { Test, TestingModule } from '@nestjs/testing';
import { InstructorsService } from '../instructors.service';
import { CreateInstructorDto } from '../create-instructor/dto/create-instructor.dto';
import { mockCreateInstructorService } from '@/utils/mocks/services/instructors';
import { handleModuleDependencies } from '@/utils';

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
});
