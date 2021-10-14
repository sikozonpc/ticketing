import { OrderCancelledEvent, Publisher, Subjects } from '@tfticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;

}