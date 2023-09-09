import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import {
  PrismaClientExceptionFilter,
  TypeErrorExceptionFilter,
} from './common/filters';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'single_sign_on',
      url: `${process.env.GRPC_SSO_HOST}:${process.env.GRPC_SSO_PORT}`,
      protoPath: join(__dirname, '../grpc/single-sign-on/single-sign-on.proto'),
      loader: { arrays: true, objects: true },
    },
  });

  app.use(cookieParser());

  app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.useGlobalFilters(new TypeErrorExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3030);
}
bootstrap();
