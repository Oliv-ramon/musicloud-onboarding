import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError, DomainErrorType } from '../../entities/domain-error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(domainErrorTypeToStatusCode(exception.type)).json({
      message: exception.getFullMessage(),
    });
  }
}

function domainErrorTypeToStatusCode(type: DomainErrorType) {
  if (type === 'invalid operation') return HttpStatus.BAD_REQUEST;
  if (type === 'invalid entity') return HttpStatus.UNPROCESSABLE_ENTITY;
  if (type === 'unauthorized') return HttpStatus.UNAUTHORIZED;
  if (type === 'entity not found') return HttpStatus.NOT_FOUND;
  return HttpStatus.BAD_REQUEST;
}
