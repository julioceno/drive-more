import { IServiceMock } from '@/common';
import { mockPrismaService } from './prisma';
import { systemHistoryMocks } from './system-history';
import { PrismaService } from '@/prisma/prisma.service';
import { instructorsMocks } from './instructors';
import { studentsMocks } from './students';

export const servicesMocks: IServiceMock[] = [
  {
    provide: PrismaService,
    useValue: mockPrismaService,
  },
  ...systemHistoryMocks,
  ...instructorsMocks,
  ...studentsMocks,
];
