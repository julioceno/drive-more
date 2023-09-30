import { IServiceMock } from '@/common';
import { mockPrismaService } from './prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { systemHistoryMocks } from './system-history';

export const servicesMocks: IServiceMock[] = [
  {
    provide: PrismaService,
    useValue: mockPrismaService,
  },
  ...systemHistoryMocks,
];
