import { IServiceMock } from '@/common';
import { mockPrismaService } from './prisma';
import { PrismaService } from 'src/prisma/prisma.service';

export const servicesMocks: IServiceMock[] = [
  {
    provide: PrismaService,
    useValue: mockPrismaService,
  },
];
