import { StatusCodes } from 'http-status-codes';
import { BaseError } from './base-error';

export class UnauthorizedError extends BaseError {
  statusCode = StatusCodes.UNAUTHORIZED;

  constructor() {
    super('unauthorized');

    // when extending a built-in class
    // this is so we can use `instanceof` of the errors we throw
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeError() {
    return {
      errors: [{ message: 'unauthorized' }],
    }
  }
}
