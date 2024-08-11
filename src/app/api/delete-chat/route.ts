import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/authConfig";
import dbConnect from "@/lib/db/config/mongoose";
import { Message } from "@/lib/db/models/Message";
import mongoose from "mongoose";

export async function DELETE(req: NextRequest) {
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

    const result = await Message.deleteOne({ userId, msgId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
