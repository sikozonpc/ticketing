import { StatusCodes } from 'http-status-codes';
import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  statusCode = StatusCodes.NOT_FOUND;

  constructor() {
    super('not found');

    // when extending a built-in class
    // this is so we can use `instanceof` of the errors we throw
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError() {
    return {
      errors: [{ message: 'not found' }],
    }
  }
}
