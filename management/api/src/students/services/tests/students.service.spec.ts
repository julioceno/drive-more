import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from '../students.service';
import { handleModuleDependencies, mockCreateStudentService } from '@/utils';
import { CreateStudentDto } from '../create-student/dto/create-student.dto';

describe('StudentsService', () => {
  let service: StudentsService;
  const creatorEmail = 'mock.creatorEmail';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentsService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke create method', async () => {
    await service.create(creatorEmail, {} as CreateStudentDto);
    expect(mockCreateStudentService.run).toHaveBeenLastCalledWith(
      creatorEmail,
      {},
    );
  });
});
