import mongoose, { Document, Schema } from "mongoose"

export interface IChat extends Document {
  title: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

const ChatSchema: Schema = new Schema({
  title: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

ChatSchema.index({ updatedAt: -1 })

export default mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema)