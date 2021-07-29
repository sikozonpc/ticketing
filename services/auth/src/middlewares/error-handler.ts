import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors/base-error';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof BaseError) {
    return res
      .status(error.statusCode)
      .send(error.serializeError());
  }

  const genericErrors = [{ message: 'Something went wrong' }];
  return res
    .status(400)
    .send({ errors: genericErrors });
};
