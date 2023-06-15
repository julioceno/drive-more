import { CreateUserService } from '@/users/services/create-user/create-user.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrismaService } from './prisma';
import { mockCreateUser } from './users';

const servicesMocks = [
  {
    provide: PrismaService,
    useValue: mockPrismaService,
  },
  {
    provide: CreateUserService,
    useValue: mockCreateUser,
  },
];

export { servicesMocks };
