import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch(TypeError)
export class TypeErrorExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(
    `@filters/${TypeErrorExceptionFilter.name}`,
  );

  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Algo inesperado aconteceu, contate o suporte.';

    this.logger.error(`There was as error ${error}`);

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
