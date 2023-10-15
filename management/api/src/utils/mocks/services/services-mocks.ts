import { IServiceMock } from '@/common';
import { mockPrismaService } from './prisma';
import { PrismaService } from '@/prisma/prisma.service';
import {
  classesMock,
  instructorsMocks,
  studentsMocks,
  systemHistoryMocks,
} from '../index';

export const servicesMocks: IServiceMock[] = [
  {
    provide: PrismaService,
    useValue: mockPrismaService,
  },
  ...systemHistoryMocks,
  ...instructorsMocks,
  ...studentsMocks,
  ...classesMock,
];
