import { INestApplication } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaClientExceptionFilter } from '@/common';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { mockSystemHistoryProxyService } from '@/utils';
import { MockAuthGuard } from './mocks/guards';
import { InstructorsModule } from '@/instructors/instructors.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [InstructorsModule],
      providers: [
        {
          provide: APP_GUARD,
          useClass: MockAuthGuard,
        },
        {
          provide: APP_FILTER,
          useClass: PrismaClientExceptionFilter,
        },
        SystemHistoryProxyService,
      ],
    })
      .overrideProvider(SystemHistoryProxyService)
      .useValue(mockSystemHistoryProxyService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/');

    console.log(response);
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });
});
