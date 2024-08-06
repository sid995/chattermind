import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import OpenAI from "openai"
import dbConnect from "@/lib/mongoose"
import Message, { IMessage } from "@/db/schema/Message"
import Chat, { IChat } from "@/db/schema/Chat"
import { authOptions } from "../auth/[...nextauth]/route"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await dbConnect()

    const { message, chatId } = await request.json()

    let chat: IChat | null
    if (chatId) {
      chat = await Chat.findById(chatId)
      if (!chat || chat.userId !== session.user.id) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 })
      }
    } else {
      chat = await Chat.create({ title: message.substring(0, 30), userId: session.user.id })
    }

    const recentMessages: IMessage[] = await Message.find({ chatId: chat!._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    const messages = recentMessages.reverse().map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    messages.push({ role: "user", content: message })

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    })

    const aiResponse = completion.choices[0].message?.content || "Sorry, I couldn't generate a response."

    await Message.create({
      content: message,
      role: "user",
      userId: session.user.id,
      chatId: chat!._id,
    })

    await Message.create({
      content: aiResponse,
      role: "assistant",
      userId: session.user.id,
      chatId: chat!._id,
    })

    await Chat.findByIdAndUpdate(chat!._id, { updatedAt: new Date() })

    return NextResponse.json({ response: aiResponse, chatId: chat!._id })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 })
  }
}