import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      default: "Untitled Conversation",
    },
    msgId: {
      type: String,
      required: true,
    },
    messages: [
      {
        role: {
          type: String,
          required: true,
          enum: ["user", "assistant", "system"],
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
