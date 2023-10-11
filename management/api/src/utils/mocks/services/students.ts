import { IServiceMock } from '@/common';
import { CreateStudentService } from '@/students/services/create-student/create-student.service';

export const mockCreateStudentService = {
  run: jest.fn(),
};

export const studentsMocks: IServiceMock[] = [
  {
    provide: CreateStudentService,
    useValue: mockCreateStudentService,
  },
];
