import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/unauthorized-error';

/**
 * Must be used after `currentUser` middleware 
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.currentUser) {
    throw new UnauthorizedError();
  }

  next();
}