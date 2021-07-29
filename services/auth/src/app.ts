import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler } from './middlewares/error-handler';
import { routes } from './routes';
import { NotFoundError } from './errors';
import { getEnv } from './util/envs';

const isTestEnv = getEnv('NODE_ENV') === 'test';

const app = express();

app.use(express.json());
app.set('trust proxy', true); // trust the Ingress Nginx load balancer 

app.use(cookieSession({
  // since JWTs are tempered protection we can opt-out of cookie encryption to allow other services to read the cookie
  signed: false,
  secure: !isTestEnv,
}));
routes(app);
app.all('*', async (req, res) => {
  throw new NotFoundError();
})
app.use(errorHandler);

export { app };
