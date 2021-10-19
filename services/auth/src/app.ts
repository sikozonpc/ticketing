import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { routes } from './routes';
import { NotFoundError, errorHandler } from '@tfticketing/common';

const isTestEnv = process.env.NODE_ENV === 'test';

const app = express();

app.use(express.json());
app.set('trust proxy', true); // trust the Ingress Nginx load balancer 

app.use(cookieSession({
  // since JWTs are tempered protection we can opt-out of cookie encryption to allow other services to read the cookie
  signed: process.env.NODE_ENV === 'production',
  keys: [process.env.JWT!],
  secure: !isTestEnv,
}));
routes(app);
app.use(errorHandler);

export { app };
