import { IServiceMock } from '@/common';
import { singleSignOn } from './single-sign-on';
import { records } from './records';
import { mockPrismaService } from './prisma';
import { PrismaService } from '@/prisma/prisma.service';

export const servicesMocks: IServiceMock[] = [
  {
    provide: PrismaService,
    useValue: mockPrismaService,
  },

  ...singleSignOn,
  ...records,
];
