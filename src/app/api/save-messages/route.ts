import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/authConfig";
import dbConnect from "@/lib/db/config/mongoose";
import { Message } from "@/lib/db/models/Message";
import mongoose from "mongoose";

type RequestType = {
  messages: any[];
  title: string;
  msgId: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, title, msgId }: RequestType = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Convert the string userId to ObjectId
    const userId = new mongoose.Types.ObjectId(session.user.id);

    // Find the existing message document for this user or create a new one
    let messageDoc = await Message.findOne({ userId, msgId });

    if (!messageDoc) {
      messageDoc = new Message({
        userId,
        messages: [],
        title,
        msgId,
      });
    }

    // Validate and add new messages to the messages array
    const newMessages = messages.map((message: any) => {
      if (!message.role || !message.content) {
        throw new Error(
          `Invalid message format. Role and content are required. Received: ${JSON.stringify(
            message
          )}`
        );
      }
      return {
        role: message.role,
        content: message.content,
        createdAt: message.createdAt || new Date(),
      };
    });

    // Instead of pushing, replace the entire messages array
    messageDoc.messages = newMessages;

    // Save the updated or new document
    await messageDoc.save();

    return NextResponse.json({
      success: true,
      savedMessages: messageDoc.messages,
    });
  } catch (error: any) {
    console.error("Failed to save messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
