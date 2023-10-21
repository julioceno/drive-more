import { ClassesModule } from '@/classes/classes.module';
import { PrismaClientExceptionFilter } from '@/common';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { mockSystemHistoryProxyService } from '@/utils';
import { INestApplication } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { addDays, addHours } from 'date-fns';
import * as request from 'supertest';
import { MockAuthGuard } from './mocks/guards';

describe('ClassesController (e2e)', () => {
  let app: INestApplication;

  const baseUrl = '/classes';

  const instructorThreeId = '0a947644-3bca-4a43-807d-4382c8600167';
  const studentThreeId = '4eb29d16-081f-4066-a758-64113a140950';
  const categoryAId = 'b21f11a0-da0d-46c4-941f-288b7ee5a31d';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ClassesModule],
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

  const date = new Date();
  const startAt = addDays(date, 5);
  const endAt = addHours(startAt, 2);

  it('/ (POST)', async () => {
    const response = await request(app.getHttpServer()).post(baseUrl).send({
      studentId: studentThreeId,
      instructorId: instructorThreeId,
      categoryId: categoryAId,
      startAt,
      endAt,
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      id: expect.any(String),
      code: expect.any(Number),
      categoryId: categoryAId,
      endAt: endAt.toISOString(),
      startAt: startAt.toISOString(),
      instructorId: instructorThreeId,
      studentId: studentThreeId,
    });
  });

  it('/ (POST -> Bad request when already exists class for time interval)', async () => {
    const response = await request(app.getHttpServer()).post(baseUrl).send({
      studentId: studentThreeId,
      instructorId: instructorThreeId,
      categoryId: categoryAId,
      startAt,
      endAt,
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      error: 'Bad Request',
      message:
        'Já existe uma aula nesse intervalo de tempo para o instrutor ou para o aluno.',
      statusCode: 400,
    });
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get(baseUrl);

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    const { totalCount, list } = response.body;

    expect(totalCount).toBe(3);
    expect(list).toStrictEqual([
      {
        id: expect.any(String),
        code: expect.any(Number),
        categoryId: expect.any(String),
        endAt: expect.any(String),
        instructorId: expect.any(String),
        startAt: expect.any(String),
        studentId: expect.any(String),
      },
      {
        id: expect.any(String),
        code: expect.any(Number),
        categoryId: expect.any(String),
        endAt: expect.any(String),
        instructorId: expect.any(String),
        startAt: expect.any(String),
        studentId: expect.any(String),
      },
      {
        id: expect.any(String),
        code: expect.any(Number),
        categoryId: expect.any(String),
        endAt: expect.any(String),
        instructorId: expect.any(String),
        startAt: expect.any(String),
        studentId: expect.any(String),
      },
    ]);
  });

  it('/:id (GET)', async () => {
    const response = await request(app.getHttpServer()).get(
      `${baseUrl}/27c6c025-7472-4afc-ad68-29593fdf7fa1`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      id: '27c6c025-7472-4afc-ad68-29593fdf7fa1',
      code: expect.any(Number),

      categoryId: categoryAId,
      instructorId: instructorThreeId,
      studentId: studentThreeId,

      startAt: expect.any(String),
      endAt: expect.any(String),
    });
  });

  it('/:id (GET -> Bad request when class not exists)', async () => {
    const response = await request(app.getHttpServer()).get(
      `${baseUrl}/mock.id`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      error: 'Not Found',
      message: 'Recurso buscado impossível de ser encontrado.',
      statusCode: 404,
    });
  });

  it('/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer()).delete(
      `${baseUrl}/62e7610b-d714-4e70-b45d-8ef40a487b6d`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });

  it('/:id (DELETE -> When class already deleted)', async () => {
    const response = await request(app.getHttpServer()).delete(
      `${baseUrl}/62e7610b-d714-4e70-b45d-8ef40a487b6d`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      error: 'Not Found',
      message: 'Recurso buscado impossível de ser encontrado.',
      statusCode: 404,
    });
  });

  it('/:id (DELETE -> When end at is after current date)', async () => {
    const response = await request(app.getHttpServer()).delete(
      `${baseUrl}/27c6c025-7472-4afc-ad68-29593fdf7fa1`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      error: 'Bad Request',
      message: 'A data de término já passou da data atual, impossível deletar.',
      statusCode: 400,
    });
  });
});
