import { NotFoundError, OrderStatus, requireAuth, UnauthorizedError } from '@tfticketing/common';
import express, { Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order
      .findById(orderId)
      .populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }

    const isUserTicket = req.currentUser!.id === order.userId;
    if (!isUserTicket) {
      throw new UnauthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  });

export { router as cancelOrderRouter };
