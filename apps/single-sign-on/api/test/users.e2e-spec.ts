import { UsersModule } from '@/users/users.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/users');

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const { totalCount, list } = response.body;

    expect(totalCount).toBe(2);
    expect(list).toStrictEqual([
      {
        id: 'fdbe66f2-f31d-4302-bb97-0ff888045292',
        email: 'admin@dirigir.more.com',
        name: 'Admin',
      },
      {
        id: '92ab7ca5-f68a-4723-8a5f-efad6caaf257',
        email: 'user@dirigir.more.com',
        name: 'User',
      },
    ]);
  });
});
