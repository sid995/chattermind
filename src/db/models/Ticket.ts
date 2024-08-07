import mongoose, { Document, Schema } from "mongoose";

export interface ITicket extends Document {
  userId: string;
  subject: string;
  category: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  subject: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);