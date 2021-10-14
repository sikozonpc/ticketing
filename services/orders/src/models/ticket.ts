import { BadRequestError, OrderStatus } from '@tfticketing/common';
import mongoose from 'mongoose';
import { Order } from './order';

interface TicketAttributes {
  id: string;
  title: string;
  price: number;
}

export interface TicketDocument extends mongoose.Document, Omit<TicketAttributes, 'id'> {
  isReserved: () => Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build: (attrs: TicketAttributes) => TicketDocument;
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

