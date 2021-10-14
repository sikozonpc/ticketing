import { NotFoundError, requireAuth, UnauthorizedError } from '@tfticketing/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId',
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

    res.status(200).send(order);
  });

export { router as getOrderRouter };
