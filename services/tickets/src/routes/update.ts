import { NotFoundError, requireAuth, UnauthorizedError, validateRequest } from '@tfticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/api/tickets/:id',
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
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    const updatedTicket = ticket.set({
      title, price,
    });
    await updatedTicket.save();

    res.status(200).send(updatedTicket);
  });

export { router as updateTicketRouter };
