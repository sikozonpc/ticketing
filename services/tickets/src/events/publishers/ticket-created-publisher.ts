import { Publisher, Subjects, TicketCreatedEvent } from '@tfticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;

}