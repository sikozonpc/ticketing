import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@tfticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const EXPIRATION_ORDER_SECONDS = 15 * 60 // 15 mins

const router = express.Router();

router.post('/api/orders',
  requireAuth,
  [
    body('ticketId').not().isEmpty().withMessage('ticketId must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // Find the ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure this ticket is not already reseved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('ticket is already reserved');
    }

    // Calculate an expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_ORDER_SECONDS);

    // Build the order and save it
    const newOrder = Order.build({
      userId: req.currentUser!.id,
      expiresAt,
      status: OrderStatus.Created,
      ticket,
    });

    await newOrder.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: newOrder.id,
      userId: newOrder.userId,
      expiresAt: newOrder.expiresAt.toISOString(),
      status: newOrder.status,
      version: newOrder.version,
      ticket: {
        id: newOrder.ticket.id,
        price: newOrder.ticket.price,
      },
    });

    res.status(201).send(newOrder);
  });

export { router as createOrderRouter };
