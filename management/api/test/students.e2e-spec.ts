import { PrismaClientExceptionFilter } from '@/common';
import { StudentsModule } from '@/students/students.module';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { mockSystemHistoryProxyService } from '@/utils';
import { INestApplication } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { MockAuthGuard } from './mocks/guards';

describe('StudentsController (e2e)', () => {
  let app: INestApplication;

  const baseUrl = '/students';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StudentsModule],
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
    const response = await request(app.getHttpServer()).get(baseUrl);

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const { totalCount, list } = response.body;
    expect(totalCount).toBe(3);
    expect(list).toStrictEqual([
      {
        code: expect.any(Number),
        cpf: '892.175.779-10',
        id: '70262a58-c48c-440e-bd00-33dc849dfd0d',
        name: 'Student 1',
      },
      {
        code: expect.any(Number),
        cpf: '488.567.780-76',
        id: '491d119d-b879-4689-9128-6321062e4152',
        name: 'Student 2',
      },
      {
        code: expect.any(Number),
        cpf: '725.198.874-78',
        id: '4eb29d16-081f-4066-a758-64113a140950',
        name: 'Student 3',
      },
    ]);
  });

  it('/:id (GET)', async () => {
    const response = await request(app.getHttpServer()).get(
      `${baseUrl}/70262a58-c48c-440e-bd00-33dc849dfd0d`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      id: '70262a58-c48c-440e-bd00-33dc849dfd0d',
      code: expect.any(Number),
      cpf: '892.175.779-10',
      name: 'Student 1',
    });
  });

  it('/:id (GET -> Bad request when student not exists)', async () => {
    const response = await request(app.getHttpServer()).get(
      `${baseUrl}/mock.id`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      'Recurso buscado impossível de ser encontrado.',
    );
  });

  it('/:id (POST)', async () => {
    const response = await request(app.getHttpServer()).post(baseUrl).send({
      name: 'Student 3',
      cpf: '709.593.442-84',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      id: expect.any(String),
      code: expect.any(Number),
      name: 'Student 3',
      cpf: '709.593.442-84',
    });
  });

  it('/:id (POST -> Bad request when cpf already exists)', async () => {
    const response = await request(app.getHttpServer()).post(baseUrl).send({
      name: 'Student 3',
      cpf: '709.593.442-84',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Cpf já existe.');
  });

  it('/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put(`${baseUrl}/491d119d-b879-4689-9128-6321062e4152`)
      .send({
        name: 'Student updated',
        cpf: '488.567.780-76',
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      id: expect.any(String),
      code: expect.any(Number),
      cpf: '488.567.780-76',
      name: 'Student updated',
    });
  });

  it('/:id (PUT -> Bad request when cpf already exists)', async () => {
    const response = await request(app.getHttpServer())
      .put(`${baseUrl}/70262a58-c48c-440e-bd00-33dc849dfd0d`)
      .send({
        name: 'student updated',
        cpf: '488.567.780-76',
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Cpf já existe.');
  });

  it('/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer()).delete(
      `${baseUrl}/491d119d-b879-4689-9128-6321062e4152`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });

  it('/:id (DELETE -> When student already deleted)', async () => {
    const response = await request(app.getHttpServer()).delete(
      `${baseUrl}/491d119d-b879-4689-9128-6321062e4152`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
  });
});
