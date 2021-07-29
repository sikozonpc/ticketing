import { ValidationError } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { BaseError } from './base-error';

export class RequestValidationError extends BaseError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(public errors: ValidationError[]) {
    super('Error, bad request');

    // when extending a built-in class
    // this is so we can use `instanceof` of the errors we throw
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError() {
    return {
      errors: this.errors.map(({ msg, param }) => ({ message: msg, field: param })),
    }
  }
}
