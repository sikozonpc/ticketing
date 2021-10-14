import { OrderStatus } from '@tfticketing/common';
import mongoose from 'mongoose';
import { TicketDocument } from './ticket';

interface OrderAttributes {
  status: OrderStatus;
  expiresAt: Date; 
  userId: string;
  ticket: TicketDocument;
}

interface OrderDocument extends mongoose.Document, OrderAttributes { }

interface OrderModel extends mongoose.Model<OrderDocument> {
  build: (attrs: OrderAttributes) => OrderDocument;
}

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
  },
  userId: {
    type: String,
    required: true,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ticket',
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

orderSchema.statics.build = (attrs: OrderAttributes) => new Order(attrs);

export const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

