import { StatusCodes } from 'http-status-codes';
import { BaseError } from './base-error';

const REASON_MSG = 'error connecting to database';

export class DatabaseConnectionError extends BaseError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  reason = REASON_MSG;

  constructor() {
    super(REASON_MSG);
    // when extending a built-in class
    // this is so we can use `instanceof` of the errors we throw
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeError() {
    return {
      errors: [{ message: this.reason }],
    }
  }
}