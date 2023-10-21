import { INestApplication } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaClientExceptionFilter } from '@/common';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { mockSystemHistoryProxyService } from '@/utils';
import { MockAuthGuard } from './mocks/guards';
import { InstructorsModule } from '@/instructors/instructors.module';

describe('InstructorsController (e2e)', () => {
  let app: INestApplication;

  const baseUrl = '/instructors';

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
    const response = await request(app.getHttpServer()).get(baseUrl);

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const { totalCount, list } = response.body;
    expect(totalCount).toBe(3);
    expect(list).toStrictEqual([
      {
        code: expect.any(Number),
        cpf: '572.249.396-17',
        id: 'b4a0aa0a-ff61-4e72-8551-26942cea858d',
        name: 'Instructor 1',
      },
      {
        code: expect.any(Number),
        cpf: '185.174.817-20',
        id: '04a6982e-ffa5-4040-b7bd-2400ae67a46f',
        name: 'Instructor 2',
      },
      {
        code: expect.any(Number),
        cpf: '400.007.853-42',
        id: '0a947644-3bca-4a43-807d-4382c8600167',
        name: 'Instructor 3',
      },
    ]);
  });

  it('/:id (GET)', async () => {
    const response = await request(app.getHttpServer()).get(
      `${baseUrl}/b4a0aa0a-ff61-4e72-8551-26942cea858d`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      id: expect.any(String),
      code: expect.any(Number),
      cpf: expect.any(String),
      name: expect.any(String),
    });
  });

  it('/:id (GET -> Bad request when instructor not exists)', async () => {
    const response = await request(app.getHttpServer()).get(
      `${baseUrl}/mock.id`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      'Recurso buscado impossível de ser encontrado.',
    );
  });

  it('/ (POST)', async () => {
    const response = await request(app.getHttpServer()).post(baseUrl).send({
      name: 'instructor 3',
      cpf: '812.754.585-64',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      id: expect.any(String),
      code: expect.any(Number),
      name: 'instructor 3',
      cpf: '812.754.585-64',
    });
  });

  it('/ (POST -> Bad request when cpf already exists)', async () => {
    const response = await request(app.getHttpServer()).post(baseUrl).send({
      name: 'instructor 3',
      cpf: '812.754.585-64',
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Cpf já existe.');
  });

  it('/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put(`${baseUrl}/04a6982e-ffa5-4040-b7bd-2400ae67a46f`)
      .send({
        name: 'instructor updated',
        cpf: '185.174.817-20',
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      id: expect.any(String),
      code: expect.any(Number),
      cpf: '185.174.817-20',
      name: 'instructor updated',
    });
  });

  it('/:id (PUT -> Bad request when cpf already exists)', async () => {
    const response = await request(app.getHttpServer())
      .put(`${baseUrl}/b4a0aa0a-ff61-4e72-8551-26942cea858d`)
      .send({
        name: 'instructor updated',
        cpf: '185.174.817-20',
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Cpf já existe.');
  });

  it('/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer()).delete(
      `${baseUrl}/04a6982e-ffa5-4040-b7bd-2400ae67a46f`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });

  it('/:id (DELETE -> When instructor already deleted)', async () => {
    const response = await request(app.getHttpServer()).delete(
      `${baseUrl}/04a6982e-ffa5-4040-b7bd-2400ae67a46f`,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
  });
});
