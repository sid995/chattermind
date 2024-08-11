import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/authConfig";
import { Message } from "@/lib/db/models/Message";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = new mongoose.Types.ObjectId(session.user.id);

  const stream = new ReadableStream({
    async start(controller) {
      const changeStream = Message.watch([
        {
          $match: {
            "fullDocument.userId": userId,
            operationType: "insert",
          },
        },
      ]);

      changeStream.on("change", async (change) => {
        const newChat = {
          msgId: change.fullDocument.msgId,
          title: change.fullDocument.title,
          createdAt: change.fullDocument.createdAt,
        };
        controller.enqueue(`data: ${JSON.stringify(newChat)}\n\n`);
      });

      // Keep the connection alive
      const intervalId = setInterval(() => {
        controller.enqueue(": keepalive\n\n");
      }, 15000);

      // Clean up on close
      req.signal.addEventListener("abort", () => {
        clearInterval(intervalId);
        changeStream.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
