import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/authConfig";
import dbConnect from "@/lib/db/config/mongoose";
import { Message } from "@/lib/db/models/Message";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const msgId = searchParams.get("msgId");

    if (!msgId) {
      return NextResponse.json({ error: "msgId is required" }, { status: 400 });
    }

    await dbConnect();

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const messageDoc = await Message.findOne({ userId, msgId });

    if (
      !messageDoc ||
      !messageDoc.messages ||
      messageDoc.messages.length === 0
    ) {
      // Instead of throwing an error, we return an empty array for messages
      return NextResponse.json({
        messages: [],
        title: messageDoc?.title || null,
      });
    }

    return NextResponse.json({
      messages: messageDoc.messages,
      title: messageDoc.title,
    });
  } catch (error: any) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
