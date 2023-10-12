import { IServiceMock } from '@/common';
import { CreateStudentService } from '@/students/services/create-student/create-student.service';
import { DeleteStudentService } from '@/students/services/delete-student/delete-student.service';
import { FindAllStudentsService } from '@/students/services/find-all-students/find-all-students.service';
import { UpdateStudentService } from '@/students/services/update-student/update-student.service';

export const mockCreateStudentService = {
  run: jest.fn(),
};

export const mockFindAllStudentsService = {
  run: jest.fn(),
};

export const mockUpdateStudentService = {
  run: jest.fn(),
};

export const mockDeleteStudentService = {
  run: jest.fn(),
};

export const studentsMocks: IServiceMock[] = [
  {
    provide: CreateStudentService,
    useValue: mockCreateStudentService,
  },
  {
    provide: FindAllStudentsService,
    useValue: mockFindAllStudentsService,
  },
  {
    provide: UpdateStudentService,
    useValue: mockUpdateStudentService,
  },
  {
    provide: DeleteStudentService,
    useValue: mockDeleteStudentService,
  },
];
