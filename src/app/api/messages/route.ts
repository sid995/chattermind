import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/mongoose"
import Message, { IMessage } from "@/db/schema/Message"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await dbConnect()

  const chatId = request.nextUrl.searchParams.get("chatId")

  if (!chatId) {
    return NextResponse.json({ error: "Chat ID is required" }, { status: 400 })
  }

  const messages: IMessage[] = await Message.find({ chatId, userId: session.user.id }).sort({ createdAt: 1 })
  return NextResponse.json(messages)
}