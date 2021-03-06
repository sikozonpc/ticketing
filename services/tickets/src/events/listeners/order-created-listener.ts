import { Listener, OrderCreatedEvent, Subjects } from '@tfticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { ticket, id } = data;

    const ticketUpdated = await Ticket.findById(ticket.id);
    if (!ticketUpdated) {
      throw new Error('ticket not found');
    }

    // Mark the ticket as reserved
    ticketUpdated.set({ orderId: id });

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