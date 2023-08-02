import { INestApplication } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { MockAuthGuard } from './mocks';
import { PrismaClientExceptionFilter } from '@/common';
import { AuthModule } from '@/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
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

  it('/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@dirigir.more.com',
        password: 'admin',
        clientId: 'eec7a35e-1540-44c8-b4a3-ebeab026da00',
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      accessToken: expect.any(String),
      refreshToken: expect.objectContaining({
        expiresIn: expect.any(Number),
      }),
    });
  });

  it('/login (POST -> Unauthorized when password is incorrect)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@dirigir.more.com',
        password: 'incorrect password',
        clientId: 'eec7a35e-1540-44c8-b4a3-ebeab026da00',
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('/login (POST -> User not authorized to access this system', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@dirigir.more.com',
        password: 'admin',
        clientId: 'mock',
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      'User not authorized to access this system.',
    );
  });

  it('/refresh-token (POST)', async () => {
    const authenticate = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@dirigir.more.com',
        password: 'admin',
        clientId: 'eec7a35e-1540-44c8-b4a3-ebeab026da00',
      });

    expect(authenticate).toBeDefined();
    expect(authenticate.status).toBe(200);

    const {
      refreshToken: { id: refreshTokenId },
    } = authenticate.body;

    const response = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .send({
        refreshTokenId,
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      accessToken: expect.any(String),
    });
  });

  it('/refresh-token (POST -> 401 Unauthorized when refreshToken not exists)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .send({
        refreshTokenId: 'mock',
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('/logout (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/auth/logout');

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });

  it('/verify-token (POST)', async () => {
    const authenticate = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@dirigir.more.com',
        password: 'admin',
        clientId: 'eec7a35e-1540-44c8-b4a3-ebeab026da00',
      });

    expect(authenticate).toBeDefined();
    expect(authenticate.status).toBe(200);

    const { accessToken } = authenticate.body;

    const response = await request(app.getHttpServer())
      .post('/auth/verify-token')
      .send({
        clientId: 'eec7a35e-1540-44c8-b4a3-ebeab026da00',
        token: accessToken,
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });

  it('/verify-token (POST -> 401 Unauthorized when token is not valid)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/verify-token')
      .send({
        clientId: 'eec7a35e-1540-44c8-b4a3-ebeab026da00',
        token: 'not valid',
      });

    expect(response).toBeDefined();
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('/verify-token (POST -> )', async () => {
    const authenticate = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@dirigir.more.com',
        password: 'admin',
        clientId: 'eec7a35e-1540-44c8-b4a3-ebeab026da00',
      });

    expect(authenticate).toBeDefined();
    expect(authenticate.status).toBe(200);

    const { accessToken } = authenticate.body;

    const response = await request(app.getHttpServer())
      .post('/auth/verify-token')
      .send({
        clientId: 'client id not valid',
        token: accessToken,
      });

    console.log(response.body);

    expect(response).toBeDefined();
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });
});
