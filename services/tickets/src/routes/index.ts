import { Express, Router } from 'express';
import { getAllTicketRouter } from './getAll';
import { getOneTicketRouter } from './getOne';
import { postTicketRouter } from './new';
import { updateTicketRouter } from './update';

const allRouters: Router[] = [
  postTicketRouter,
  getOneTicketRouter,
  getAllTicketRouter,
  updateTicketRouter,
];

export const routes = (app: Express) => {
  allRouters.map((router) => {
    return app.use(router);
  });
};
