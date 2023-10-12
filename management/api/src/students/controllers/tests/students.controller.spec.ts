import { CreateStudentDto } from '@/students/services/create-student/dto/create-student.dto';
import { FindAllStudentsDto } from '@/students/services/find-all-students/dto/find-all-students.dto';
import { StudentsService } from '@/students/services/students.service';
import { UpdateStudentDto } from '@/students/services/update-student/dto/update-student.dto';
import {
  handleModuleDependencies,
  mockCreateStudentService,
  mockDeleteStudentService,
  mockFindAllStudentsService,
  mockFindOneStudentService,
  mockUpdateStudentService,
} from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from '../students.controller';

describe('StudentsController', () => {
  let controller: StudentsController;

  const id = 'mock.id';
  const creatorEmail = 'mock.creatorEmail';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [StudentsService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('should invoke create method from StudentsController', async () => {
    await controller.create(creatorEmail, {} as CreateStudentDto);
    expect(mockCreateStudentService.run).toHaveBeenLastCalledWith(
      creatorEmail,
      {},
    );
  });

  it('should invoke findAll method from StudentsController', async () => {
    await controller.findAll({} as FindAllStudentsDto);
    expect(mockFindAllStudentsService.run).toHaveBeenLastCalledWith({});
  });

  it('should invoke update method from StudentsController', async () => {
    await controller.update(id, creatorEmail, {} as UpdateStudentDto);
    expect(mockUpdateStudentService.run).toHaveBeenLastCalledWith(
      id,
      creatorEmail,
      {},
    );
  });

  it('should invoke delete method from StudentsController', async () => {
    await controller.delete(id, creatorEmail);
    expect(mockDeleteStudentService.run).toHaveBeenLastCalledWith(
      id,
      creatorEmail,
    );
  });

  it('should invoke findOne method from StudentsController', async () => {
    await controller.findOne(id);
    expect(mockFindOneStudentService.run).toHaveBeenLastCalledWith(id);
  });
});
