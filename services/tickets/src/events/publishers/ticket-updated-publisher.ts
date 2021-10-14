import { Publisher, Subjects, TicketUpdatedEvent } from '@tfticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;

}