import { requireAuth, validateRequest, } from '@tfticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/tickets',
  requireAuth, [
  body('title')
    .not().isEmpty()
    .isLength({ min: 4, max: 20 }),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('price must be greater than 0')
],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const userId = req.currentUser?.id!;

    const ticket = Ticket.build({ title, price, userId })
    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  });

export { router as postTicketRouter };
