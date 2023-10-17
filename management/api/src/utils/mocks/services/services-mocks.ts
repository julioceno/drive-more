import { IServiceMock } from '@/common';
import { mockPrismaService } from './prisma';
import { PrismaService } from '@/prisma/prisma.service';
import { systemHistoryMocks } from './system-history';
import { instructorsMocks } from './instructors';
import { studentsMocks } from './students';
import { classesMock } from './classes';

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
