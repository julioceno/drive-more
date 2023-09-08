import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(TypeError)
export class TypeErrorExceptionFilter implements ExceptionFilter {
  catch(_, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Algo inesperado aconteceu, contate o suporte.';

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
