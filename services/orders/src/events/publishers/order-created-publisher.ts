import { OrderCreatedEvent, Publisher, Subjects } from '@tfticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

}