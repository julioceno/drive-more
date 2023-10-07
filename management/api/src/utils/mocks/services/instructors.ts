import { IServiceMock } from '@/common';
import { CreateInstructorService } from '@/instructors/services/create-instructor/create-instructor.service';
import { FindAllInstructorsDto } from '@/instructors/services/find-all-instructors/dto/find-all-instructors.dto';
import { FindAllInstructorsService } from '@/instructors/services/find-all-instructors/find-all-instructors.service';

export const mockCreateInstructorService = {
  run: jest.fn(),
};

export const mockFindAllInstructorsService = {
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
];
