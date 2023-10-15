import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import {
  PrismaClientExceptionFilter,
  TypeErrorExceptionFilter,
} from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.useGlobalFilters(new TypeErrorExceptionFilter());

  await Promise.all([
    app.startAllMicroservices(),
    app.listen(process.env.PORT || 3032),
  ]);
}
bootstrap();
