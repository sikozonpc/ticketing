import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from '@tfticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findByEvent({ id, version });
    if (!ticket) {
      throw new Error('ticket not found or event is out of order');
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}