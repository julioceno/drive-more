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

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'system_history',
      url: `${process.env.GRPC_SYSTEM_HISTORY_HOST}:${process.env.GRPC_SYSTEM_HISTORY_PORT}`,
      protoPath: join(__dirname, '../grpc/system-history/system-history.proto'),
      loader: { arrays: true, objects: true },
    },
  });

  app.use(cookieParser());

  app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.useGlobalFilters(new TypeErrorExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3031);
}

bootstrap();
