import { StatusCodes } from 'http-status-codes';
import { BaseError } from './base-error';

export class BadRequestError extends BaseError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(public message: string) {
    super(message);

    // when extending a built-in class
    // this is so we can use `instanceof` of the errors we throw
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeError() {
    return {
      errors: [{ message: this.message }],
    }
  }
}
