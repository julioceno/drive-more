import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrismaService } from './prisma';
import { usersMocks } from './users';
import { mockJwtService } from './jwt';
import { ConfigService } from '@nestjs/config';
import { mockConfigService } from './config';
import { auth } from './auth';
import { IServiceMock } from '@/common';
import { systemHistoryMocks } from './system-history';

const servicesMocks: IServiceMock[] = [
  {
    provide: PrismaService,
    useValue: mockPrismaService,
  },
  {
    provide: JwtService,
    useValue: mockJwtService,
  },
  {
    provide: ConfigService,
    useValue: mockConfigService,
  },

  ...usersMocks,
  ...auth,
  ...systemHistoryMocks,
];

export { servicesMocks };
