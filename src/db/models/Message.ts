import mongoose, { Document, Schema } from "mongoose"

export interface IMessage extends Document {
  content: string
  role: "user" | "assistant"
  userId: string
  chatId: Schema.Types.ObjectId
  createdAt: Date
}

const MessageSchema: Schema = new Schema({
  content: { type: String, required: true },
  role: { type: String, required: true, enum: ["user", "assistant"] },
  userId: { type: String, required: true, index: true },
  chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema)