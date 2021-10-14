import { Express, Router } from 'express';
import { getOrderRouter } from './get';
import { createOrderRouter } from './new';
import { cancelOrderRouter } from './cancel';
import { getAllOrderRouter } from './getAll';

const allRouters: Router[] = [
  getOrderRouter,
  createOrderRouter,
  cancelOrderRouter,
  getAllOrderRouter,
];

export const routes = (app: Express) => {
  allRouters.map((router) => {
    return app.use(router);
  });
};
