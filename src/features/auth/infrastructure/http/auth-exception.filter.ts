import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';

import type { Response } from 'express';
import DomainValidationError from '../../../../shared/domain/errors/domain-validation.error.js';
import { UserEmailAlreadyExistsError } from '../../../users/application/user.errors.js';

import {
  InvalidCredentialsError,
  UserNotFoundError,
} from '../../application/auth.errors.js';

@Catch(
  InvalidCredentialsError,
  UserEmailAlreadyExistsError,
  UserNotFoundError,
  DomainValidationError,
)
export default class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    let httpException:
      BadRequestException | ConflictException | UnauthorizedException;

    if (exception instanceof UserEmailAlreadyExistsError) {
      httpException = new ConflictException(exception.message);
    } else if (
      exception instanceof InvalidCredentialsError ||
      exception instanceof UserNotFoundError
    ) {
      httpException = new UnauthorizedException(exception.message);
    } else {
      httpException = new BadRequestException(exception.message);
    }

    const response = host.switchToHttp().getResponse<Response>();
    response
      .status(httpException.getStatus())
      .json(httpException.getResponse());
  }
}
