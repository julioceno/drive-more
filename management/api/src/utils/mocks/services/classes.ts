import { CreateClassService } from '@/classes/services/create-class/create-class.service';
import { DeleteClassService } from '@/classes/services/delete-class/delete-class.service';
import { FindAllClassesService } from '@/classes/services/find-all-classes/find-all-classes.service';
import { FindOneClassService } from '@/classes/services/find-one-class/find-one-class.service';
import { IServiceMock } from '@/common';

export const mockCreateClassService = { run: jest.fn() };
export const mockFindAllClassesService = { run: jest.fn() };
export const mockDeleteClassService = { run: jest.fn() };
export const mockFindOneClassService = { run: jest.fn() };

export const classesMock: IServiceMock[] = [
  {
    provide: CreateClassService,
    useValue: mockCreateClassService,
  },
  {
    provide: FindAllClassesService,
    useValue: mockFindAllClassesService,
  },
  {
    provide: DeleteClassService,
    useValue: mockDeleteClassService,
  },
  {
    provide: FindOneClassService,
    useValue: mockFindOneClassService,
  },
];
