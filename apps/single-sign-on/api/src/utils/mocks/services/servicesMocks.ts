import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrismaService } from './prisma';

const servicesMocks = [
  {
    provide: PrismaService,
    useValue: mockPrismaService,
  },
];

export { servicesMocks };
