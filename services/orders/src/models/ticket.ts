import { BadRequestError, OrderStatus } from '@tfticketing/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoose from 'mongoose';
import { Order } from './order';

interface Event { id: string; version: number }

interface TicketAttributes {
  id: string;
  title: string;
  price: number;
}

export interface TicketDocument extends mongoose.Document, Omit<TicketAttributes, 'id'> {
  version: number;
  isReserved: () => Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build: (attrs: TicketAttributes) => TicketDocument;
  findByEvent: (event: Event) => Promise<TicketDocument | null>;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

// Implements the Optimistic Concurrency Control
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: Event) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
}

ticketSchema.statics.build = (attrs: TicketAttributes) => {
  const { id, ...props } = attrs;
  return new Ticket({
    _id: id,
    ...props,
  });
}

ticketSchema.methods.isReserved = async function () {
  const ticket = this as TicketDocument;
  const existingOrder = await Order.findOne({
    ticket,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    }
  });
  return Boolean(existingOrder);
}


const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema);
export { Ticket };

