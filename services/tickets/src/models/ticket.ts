import mongoose from 'mongoose';

interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

interface TicketDocument extends mongoose.Document, TicketAttributes { }

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
  },
  userId: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    versionKey: false,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

ticketSchema.statics.build = (attrs: TicketAttributes) => new Ticket(attrs);

export const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema);

