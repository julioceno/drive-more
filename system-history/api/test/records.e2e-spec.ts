import { PrismaClientExceptionFilter } from '@/common';
import { RecordsModule } from '@/records/records.module';
import { INestApplication } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Action } from '@prisma/client';
import * as request from 'supertest';
import { MockAuthGuard } from './mocks/guards';

describe('RecordsController (e2e)', () => {
  let app: INestApplication;

  const baseUrl = '/records';

  const payload = {
    'Identificador Técnico': '2929c915-acaf-4773-aaad-caa67c1f8bbd',
    Código: 21,
    Nome: 'test',
    Email: 'newemail@dirigir.more.com',
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
      action: Action.UPDATE,
      entityId: '1',
      payload: payload,
      moduleName: 'SINGLE SING ON',
      resourceName: 'USERS',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      action: Action.UPDATE,
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
      entityId: '2',
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
      entityId: '2',
      id: expect.any(String),
      payload,
      resourceId: expect.any(String),
    });
  });

  it('/ (POST -> Create new record when payload is only an string)', async () => {
    const payload = `Password from user newemail@dirigir.more.com is modified`;

    const response = await request(app.getHttpServer()).post(baseUrl).send({
      creatorEmail: 'user@dirigir.more.com',
      action: Action.UPDATE,
      entityId: '1',
      payload,
      moduleName: 'SINGLE SING ON',
      resourceName: 'USERS',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      action: Action.UPDATE,
      code: expect.any(Number),
      createdAt: expect.any(String),
      creatorEmail: 'user@dirigir.more.com',
      entityId: '1',
      id: expect.any(String),
      payload,
      resourceId: '9218d387-01af-4755-8a13-a7f13b79a753',
    });
  });

  it('/diffs (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`${baseUrl}/diffs`);

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const { totalCount, list } = response.body;

    expect(totalCount).toBe(4);
    expect(list).toStrictEqual([
      {
        action: 'UPDATE',
        code: 4,
        createdAt: expect.any(String),
        creatorEmail: 'user@dirigir.more.com',
        diffs: 'Password from user newemail@dirigir.more.com is modified',
        entityId: '1',
        id: expect.any(String),
        module: 'SINGLE SING ON',
        resource: 'USERS',
      },
      {
        action: 'CREATE',
        code: 3,
        createdAt: expect.any(String),
        creatorEmail: 'user@dirigir.more.com',
        diffs: [
          {
            field: 'Nome',
            newValue: 'test',
            oldValue: null,
          },
          {
            field: 'Email',
            newValue: 'newemail@dirigir.more.com',
            oldValue: null,
          },
          {
            field: 'Papel',
            newValue: 'Usuário',
            oldValue: null,
          },
          {
            field: 'Código',
            newValue: 21,
            oldValue: null,
          },
          {
            field: 'Data de Criação',
            newValue: '2023-09-09T16:14:23.842Z',
            oldValue: null,
          },
          {
            field: 'Data de Atualização',
            newValue: '2023-09-09T16:14:23.842Z',
            oldValue: null,
          },
          {
            field: 'Identificador Técnico',
            newValue: '2929c915-acaf-4773-aaad-caa67c1f8bbd',
            oldValue: null,
          },
        ],
        entityId: '2',
        id: expect.any(String),
        module: 'CORE',
        resource: 'MAIN',
      },
      {
        action: 'UPDATE',
        code: 2,
        createdAt: expect.any(String),
        creatorEmail: 'user@dirigir.more.com',
        diffs: [
          {
            field: 'Email',
            newValue: 'newemail@dirigir.more.com',
            oldValue: 'email@dirigir.more.com',
          },
        ],
        entityId: '1',
        id: expect.any(String),
        module: 'SINGLE SING ON',
        resource: 'USERS',
      },
      {
        action: 'CREATE',
        code: 1,
        createdAt: expect.any(String),
        creatorEmail: 'user@dirigir.more.com',
        diffs: [
          {
            field: 'Nome',
            newValue: 'test',
            oldValue: null,
          },
          {
            field: 'Email',
            newValue: 'email@dirigir.more.com',
            oldValue: null,
          },
          {
            field: 'Papel',
            newValue: 'Usuário',
            oldValue: null,
          },
          {
            field: 'Código',
            newValue: 21,
            oldValue: null,
          },
          {
            field: 'Data de Criação',
            newValue: '2023-09-09T16:14:23.842Z',
            oldValue: null,
          },
          {
            field: 'Data de Atualização',
            newValue: '2023-09-09T16:14:23.842Z',
            oldValue: null,
          },
          {
            field: 'Identificador Técnico',
            newValue: '2929c915-acaf-4773-aaad-caa67c1f8bbd',
            oldValue: null,
          },
        ],
        entityId: '1',
        id: expect.any(String),
        module: 'SINGLE SING ON',
        resource: 'USERS',
      },
    ]);
  });

  it('/diffs (GET -> Find records by entityId equal 1)', async () => {
    const response = await request(app.getHttpServer()).get(
      `${baseUrl}/diffs?entityId=1`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const { totalCount, list } = response.body;

    expect(totalCount).toBe(3);
    expect(list).toStrictEqual([
      {
        action: 'UPDATE',
        code: 4,
        createdAt: expect.any(String),
        creatorEmail: 'user@dirigir.more.com',
        diffs: 'Password from user newemail@dirigir.more.com is modified',
        entityId: '1',
        id: expect.any(String),
        module: 'SINGLE SING ON',
        resource: 'USERS',
      },
      {
        action: 'UPDATE',
        code: 2,
        createdAt: expect.any(String),
        creatorEmail: 'user@dirigir.more.com',
        diffs: [
          {
            field: 'Email',
            newValue: 'newemail@dirigir.more.com',
            oldValue: 'email@dirigir.more.com',
          },
        ],
        entityId: '1',
        id: expect.any(String),
        module: 'SINGLE SING ON',
        resource: 'USERS',
      },
      {
        action: 'CREATE',
        code: 1,
        createdAt: expect.any(String),
        creatorEmail: 'user@dirigir.more.com',
        diffs: [
          {
            field: 'Nome',
            newValue: 'test',
            oldValue: null,
          },
          {
            field: 'Email',
            newValue: 'email@dirigir.more.com',
            oldValue: null,
          },
          {
            field: 'Papel',
            newValue: 'Usuário',
            oldValue: null,
          },
          {
            field: 'Código',
            newValue: 21,
            oldValue: null,
          },
          {
            field: 'Data de Criação',
            newValue: '2023-09-09T16:14:23.842Z',
            oldValue: null,
          },
          {
            field: 'Data de Atualização',
            newValue: '2023-09-09T16:14:23.842Z',
            oldValue: null,
          },
          {
            field: 'Identificador Técnico',
            newValue: '2929c915-acaf-4773-aaad-caa67c1f8bbd',
            oldValue: null,
          },
        ],
        entityId: '1',
        id: expect.any(String),
        module: 'SINGLE SING ON',
        resource: 'USERS',
      },
    ]);
  });
});
