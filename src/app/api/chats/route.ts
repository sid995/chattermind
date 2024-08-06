import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/mongoose"
import Chat, { IChat } from "@/db/schema/Chat"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await dbConnect()

  const chats: IChat[] = await Chat.find({ userId: session.user.id }).sort({ updatedAt: -1 })
  return NextResponse.json(chats)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.name) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await dbConnect()

  const { title } = await request.json()
  const newChat: IChat = await Chat.create({ title, userId: session.user.id })
  return NextResponse.json(newChat, { status: 201 })
}