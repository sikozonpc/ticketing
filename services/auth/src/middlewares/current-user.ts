import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getEnv } from '../util/envs';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload,
    }
  }
};

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const decodedToken = jwt.verify(req.session?.jwt, getEnv('JWT_KEY')) as UserPayload;
    req.currentUser = decodedToken;
  } catch (error) { }

  next();
}