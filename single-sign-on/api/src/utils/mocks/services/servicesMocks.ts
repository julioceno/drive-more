import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrismaService } from './prisma';
import { usersMocks } from './users';
import { mockJwtService } from './jwt';
import { ConfigService } from '@nestjs/config';
import { mockConfigService } from './config';
import { auth } from './auth';
import { IServiceMock } from '@/common';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { mockSystemHistoryervice } from './system-history';

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
  {
    provide: SystemHistoryProxyService,
    useValue: mockSystemHistoryervice,
  },

  ...usersMocks,
  ...auth,
];

export { servicesMocks };
