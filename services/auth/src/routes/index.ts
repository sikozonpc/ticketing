import { Express, Router } from 'express';
import { NotFoundError } from '@tfticketing/common';
import { authRouter } from './users';
export { authRouter } from './users';

const allRoutes: { url: string, router: Router }[] = [
  { url: '/api/users', router: authRouter },
];

export const routes = (app: Express) => {
  allRoutes.map((route) => {
    console.log(`${route.url}`);
    return app.use(route.url, route.router);
  });

  app.all('*', async () => {
    throw new NotFoundError();
  })
}
