import { CommomErrorResponse } from './types';
import { StatusCodes } from 'http-status-codes';

export abstract class BaseError extends Error {
  abstract statusCode: StatusCodes;
  constructor(message: string) {
    super(message);

    // when extending a built-in class
    // this is so we can use `instanceof` of the errors we throw
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract serializeError(): CommomErrorResponse;
}