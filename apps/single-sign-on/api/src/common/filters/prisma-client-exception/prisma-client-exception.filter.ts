import { capitalizeFirstLetter } from '@/common/functions';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002':
        const status = HttpStatus.CONFLICT;

        const list = exception.meta.target as string[];
        const fieldOrFields = capitalizeFirstLetter(list.join(', '));

        const message =
          list.length > 1
            ? `${fieldOrFields} já existem.`
            : `${fieldOrFields} já existe.`;

        response.status(status).json({
          statusCode: status,
          message,
        });
        break;
      case 'P2025': {
        const status = HttpStatus.BAD_REQUEST;
        const message = 'Registro não encontrado.';

        response.status(status).json({
          statusCode: status,
          message,
        });
        break;
      }

      default: {
        // default 500 error code

        super.catch(exception, host);
        break;
      }
    }
  }
}
