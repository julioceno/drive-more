import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import {
  PrismaClientExceptionFilter,
  TypeErrorExceptionFilter,
} from './common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  console.log(`${process.env.GRPC_LOGS_HOST}:${process.env.GRPC_LOGS_PORT}`);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'system_history',
      url: `${process.env.GRPC_LOGS_HOST}:${process.env.GRPC_LOGS_PORT}`,
      protoPath: join(__dirname, '../grpc/logs/logs.proto'),
      loader: { arrays: true, objects: true },
    },
  });

  app.use(cookieParser());

  app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.useGlobalFilters(new TypeErrorExceptionFilter());

  await app.listen(process.env.PORT || 3031);
}

bootstrap();
