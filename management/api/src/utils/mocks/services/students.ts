import { IServiceMock } from '@/common';
import { CreateStudentService } from '@/students/services/create-student/create-student.service';
import { FindAllStudentsService } from '@/students/services/find-all-students/find-all-students.service';

export const mockCreateStudentService = {
  run: jest.fn(),
};

export const mockFindAllStudentsService = {
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
];
