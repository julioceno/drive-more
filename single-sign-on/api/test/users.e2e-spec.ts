import { UsersModule } from '@/users/users.module';
import { INestApplication } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { MockAuthGuard } from './mocks';
import { PrismaClientExceptionFilter } from '@/common';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { mockSystemHistoryProxyService } from '@/utils';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
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
    const response = await request(app.getHttpServer()).get('/users');

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const { totalCount, list } = response.body;

    expect(totalCount).toBe(3);
    expect(list).toStrictEqual([
      {
        id: 'fdbe66f2-f31d-4302-bb97-0ff888045292',
        email: 'admin@drive.more.com',
        name: 'Admin',
      },
      {
        id: '92ab7ca5-f68a-4723-8a5f-efad6caaf257',
        email: 'user@drive.more.com',
        name: 'User',
      },
      {
        id: 'c63fb8c3-e238-4785-8907-273ede43f489',
        name: 'User for delete',
        email: 'userForDelete@drive.more.com',
      },
    ]);
  });

  it('/ (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'c3po',
      email: 'c3po@drive.more.com.br',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      id: expect.any(String),
      name: 'c3po',
      email: 'c3po@drive.more.com.br',
      password: expect.any(String),
    });
  });

  it('/ (POST -> Bad request when user already exists)', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'Other user',
      email: 'user@drive.more.com',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Usuário já existe.');
  });

  it('/ (PUT)', async () => {
    const response = await request(app.getHttpServer()).put('/users').send({
      name: 'userUpdated',
      email: 'userUpdated@drive.more.com.br',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      id: expect.any(String),
      name: 'userUpdated',
      email: 'userUpdated@drive.more.com.br',
    });
  });

  it('/ (PUT -> 409 Throw conflict error when email already exists in other user)', async () => {
    const response = await request(app.getHttpServer()).put('/users').send({
      name: 'other name',
      email: 'c3po@drive.more.com.br',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email já existe.');
  });

  it('/ (PATCH -> update password)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/password')
      .send({
        currentPassword: 'user',
        password: 'newPass',
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      id: expect.any(String),
      name: 'userUpdated',
      email: 'userUpdated@drive.more.com.br',
    });
  });

  it('/ (PATCH -> 401 throw unauthorized when password is incorrect)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/password')
      .send({
        currentPassword: 'passIncorrect',
        password: 'newPass',
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('/ (PATCH -> Change role from passed user)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/change-role')
      .send({
        role: 'ADMIN',
        userId: 'c63fb8c3-e238-4785-8907-273ede43f489',
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      id: 'c63fb8c3-e238-4785-8907-273ede43f489',
      email: 'userForDelete@drive.more.com',
      name: 'User for delete',
      role: 'ADMIN',
    });
  });

  it('/ (DELETE)', async () => {
    const response = await request(app.getHttpServer()).delete(
      '/users/c63fb8c3-e238-4785-8907-273ede43f489',
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      id: expect.any(String),
      name: 'User for delete',
      email: 'userForDelete@drive.more.com',
    });
  });

  it('/ (DELETE -> 400 Register not found)', async () => {
    const response = await request(app.getHttpServer()).delete('/users/id');

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Registro não encontrado.');
  });
});
