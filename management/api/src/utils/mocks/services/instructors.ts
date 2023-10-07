import { IServiceMock } from '@/common';
import { CreateInstructorService } from '@/instructors/services/create-instructor/create-instructor.service';
import { FindAllInstructorsService } from '@/instructors/services/find-all-instructors/find-all-instructors.service';
import { UpdateInstructorService } from '@/instructors/services/update-instructor/update-instructor.service';

export const mockCreateInstructorService = {
  run: jest.fn(),
};

export const mockFindAllInstructorsService = {
  run: jest.fn(),
};

export const mockUpdateInstructorService = {
  run: jest.fn(),
};

export const instructorsMocks: IServiceMock[] = [
  {
    provide: CreateInstructorService,
    useValue: mockCreateInstructorService,
  },
  {
    provide: FindAllInstructorsService,
    useValue: mockFindAllInstructorsService,
  },
  {
    provide: UpdateInstructorService,
    useValue: mockUpdateInstructorService,
  },
];
