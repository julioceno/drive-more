import { IServiceMock } from '@/common';
import { CreateInstructorService } from '@/instructors/services/create-instructor/create-instructor.service';

export const mockCreateInstructorService = {
  run: jest.fn(),
};

export const instructorsMocks: IServiceMock[] = [
  {
    provide: CreateInstructorService,
    useValue: mockCreateInstructorService,
  },
];
