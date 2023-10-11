import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from '../students.controller';
import { StudentsService } from '@/students/services/students.service';
import { handleModuleDependencies, mockCreateStudentService } from '@/utils';
import { CreateStudentDto } from '@/students/services/create-student/dto/create-student.dto';

const creatorEmail = 'mock.creatorEmail';

describe('StudentsController', () => {
  let controller: StudentsController;

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
});
