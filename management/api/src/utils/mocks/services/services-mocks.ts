import { IServiceMock } from '@/common';
import { mockPrismaService } from './prisma';
import { systemHistoryMocks } from './system-history';
import { PrismaService } from '@/prisma/prisma.service';

export const servicesMocks: IServiceMock[] = [
  {
    provide: PrismaService,
    useValue: mockPrismaService,
  },
  ...systemHistoryMocks,
];
