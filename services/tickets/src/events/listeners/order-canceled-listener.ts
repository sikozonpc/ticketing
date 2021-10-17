import { Listener, OrderCancelledEvent, Subjects } from '@tfticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { ticket } = data;

    const ticketUpdated = await Ticket.findById(ticket.id);
    if (!ticketUpdated) {
      throw new Error('ticket not found');
    }

    ticketUpdated.set({ orderId: null });

    await ticketUpdated.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticketUpdated.id,
      price: ticketUpdated.price,
      title: ticketUpdated.title,
      userId: ticketUpdated.userId,
      version: ticketUpdated.version,
      orderId: ticketUpdated.orderId,
    });

    msg.ack();
  }
}