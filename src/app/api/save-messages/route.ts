import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/authConfig"; // Adjust this import based on your Next-auth v5 setup
import dbConnect from "@/lib/db/config/mongoose"; // Adjust this import based on your actual database connection file
import { Message } from "@/lib/db/models/Message"; // We'll update this model next

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, messages } = await req.json();

    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Save all messages
    const savedMessages = await Promise.all(
      messages.map(async (message: any) => {
        const newMessage = new Message({
          userId,
          role: message.role,
          content: message.content,
        });
        return newMessage.save();
      })
    );

    console.log(savedMessages);

    return NextResponse.json({ success: true, savedMessages });
  } catch (error) {
    console.error("Failed to save messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
