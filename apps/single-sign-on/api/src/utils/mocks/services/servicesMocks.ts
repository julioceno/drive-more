import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrismaService } from './prisma';
import { usersMocks } from './users';

const servicesMocks = [
  {
    provide: PrismaService,
    useValue: mockPrismaService,
  },

  ...usersMocks,
];

export { servicesMocks };
