import { RecordsModule } from '@/records/records.module';
import { INestApplication } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { MockAuthGuard } from './mocks/guards';
import { PrismaClientExceptionFilter } from '@/common';
import { Action } from '@prisma/client';

describe('RecordsController (e2e)', () => {
  let app: INestApplication;

  const baseUrl = '/records';

  const payload = {
    'Identificador Técnico': '2929c915-acaf-4773-aaad-caa67c1f8bbd',
    Código: 21,
    Nome: 'test',
    Email: 'test21@dirigir.more.com',
    Papel: 'Usuário',
    'Data de Criação': '2023-09-09T16:14:23.842Z',
    'Data de Atualização': '2023-09-09T16:14:23.842Z',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RecordsModule],
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

  it('/ (POST)', async () => {
    const response = await request(app.getHttpServer()).post(baseUrl).send({
      creatorEmail: 'user@dirigir.more.com',
      action: Action.CREATE,
      entityId: '1',
      payload: payload,
      moduleName: 'SINGLE SING ON',
      resourceName: 'USERS',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      action: Action.CREATE,
      code: expect.any(Number),
      createdAt: expect.any(String),
      creatorEmail: 'user@dirigir.more.com',
      entityId: '1',
      id: expect.any(String),
      payload,
      resourceId: '9218d387-01af-4755-8a13-a7f13b79a753',
    });
  });

  it('/ (POST -> Create new Module and new Resource, before create history record)', async () => {
    const response = await request(app.getHttpServer()).post(baseUrl).send({
      creatorEmail: 'user@dirigir.more.com',
      action: Action.CREATE,
      entityId: '1',
      payload: payload,
      moduleName: 'CORE',
      resourceName: 'MAIN',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      action: Action.CREATE,
      code: expect.any(Number),
      createdAt: expect.any(String),
      creatorEmail: 'user@dirigir.more.com',
      entityId: '1',
      id: expect.any(String),
      payload,
      resourceId: expect.any(String),
    });
  });
});
