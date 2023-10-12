import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from '../students.service';
import {
  handleModuleDependencies,
  mockCreateStudentService,
  mockDeleteStudentService,
  mockFindAllStudentsService,
  mockUpdateStudentService,
} from '@/utils';
import { CreateStudentDto } from '../create-student/dto/create-student.dto';
import { FindAllStudentsDto } from '../find-all-students/dto/find-all-students.dto';
import { UpdateStudentDto } from '../update-student/dto/update-student.dto';

describe('StudentsService', () => {
  let service: StudentsService;

  const id = 'mock.id';
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

  it('should invoke findAll method', async () => {
    await service.findAll({} as FindAllStudentsDto);
    expect(mockFindAllStudentsService.run).toHaveBeenLastCalledWith({});
  });

  it('should invoke update method', async () => {
    await service.update(id, creatorEmail, {} as UpdateStudentDto);
    expect(mockUpdateStudentService.run).toHaveBeenLastCalledWith(
      id,
      creatorEmail,
      {},
    );
  });

  it('should invoke delete method', async () => {
    await service.delete(id, creatorEmail);
    expect(mockDeleteStudentService.run).toHaveBeenLastCalledWith(
      id,
      creatorEmail,
    );
  });
});
