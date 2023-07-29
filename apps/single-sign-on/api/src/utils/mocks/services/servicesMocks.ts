import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrismaService } from './prisma';
import { usersMocks } from './users';
import { mockJwtService } from './jwt';
import { ConfigService } from '@nestjs/config';
import { mockConfigService } from './config';

const servicesMocks: { provide: any; useValue: any }[] = [
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
];

export { servicesMocks };
