import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
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
      package: 'single_sign_on',
      protoPath: join(__dirname, './grpc/single-sign-on.proto'),
    },
  });

  app.use(cookieParser());

  app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.useGlobalFilters(new TypeErrorExceptionFilter());

  await app.listen(process.env.PORT || 3031);
}
bootstrap();