import { UsersModule } from '@/users/users.module';
import { INestApplication } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { MockAuthGuard } from './mocks';
import { PrismaClientExceptionFilter } from '@/common';

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
      ],
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

  it('/ (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'c3po',
      email: 'c3po@dirigir.more.com.br',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      id: expect.any(String),
      name: 'c3po',
      email: 'c3po@dirigir.more.com.br',
      password: expect.any(String),
    });
  });

  it('/ (POST -> Bad request when user already exists)', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'Other user',
      email: 'user@dirigir.more.com',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Usuário já existe.');
  });

  it('/ (PUT)', async () => {
    const response = await request(app.getHttpServer()).put('/users').send({
      name: 'adminUpdated',
      email: 'adminUpdated@dirigir.more.com.br',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      id: expect.any(String),
      name: 'adminUpdated',
      email: 'adminUpdated@dirigir.more.com.br',
    });
  });

  it('/ (PUT -> throw Conflict error when email already exists in other user)', async () => {
    const response = await request(app.getHttpServer()).put('/users').send({
      name: 'other name',
      email: 'c3po@dirigir.more.com.br',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email já existe.');
  });
});
