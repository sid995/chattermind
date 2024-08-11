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

    await dbConnect();

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const chats = await Message.find({ userId })
      .select("msgId title createdAt")
      .sort({ createdAt: -1 })
      .limit(50); // Fetch the 50 most recent chats

    return NextResponse.json({ chats });
  } catch (error: any) {
    console.error("Failed to fetch chats:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
