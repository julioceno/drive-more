import { CreateClassService } from '@/classes/services/create-class/create-class.service';
import { FindAllClassesService } from '@/classes/services/find-all-classes/find-all-classes.service';
import { IServiceMock } from '@/common';

export const mockCreateClassService = { run: jest.fn() };
export const mockFindAllClassesService = { run: jest.fn() };

export const classesMock: IServiceMock[] = [
  {
    provide: CreateClassService,
    useValue: mockCreateClassService,
  },
  {
    provide: FindAllClassesService,
    useValue: mockFindAllClassesService,
  },
];
