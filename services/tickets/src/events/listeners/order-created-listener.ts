import { Listener, OrderCreatedEvent, Subjects } from '@tfticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { ticket } = data;

    const ticketFound = await Ticket.findById(ticket.id);
    if (!ticketFound) {
      throw new Error('ticket not found');
    }

    await ticketFound.save();

    msg.ack();
  }
}