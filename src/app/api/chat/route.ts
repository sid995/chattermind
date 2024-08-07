import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import OpenAI from "openai";
import dbConnect from "@/lib/mongoose";
import Ticket from "@/db/models/Ticket";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { ticketId, message } = await request.json();

  const ticket = await Ticket.findById(ticketId);
  if (!ticket || ticket.userId !== session.user.id) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful customer support assistant." },
      { role: "user", content: `Ticket: ${ticket.subject}\nCategory: ${ticket.category}\nDescription: ${ticket.description}\nCustomer message: ${message}` },
    ],
  });

  const aiResponse = completion.choices[0].message?.content || "Sorry, I couldn't generate a response.";

  // Update ticket with new message
  await Ticket.findByIdAndUpdate(ticketId, {
    $push: { messages: { role: "user", content: message } },
    $set: { updatedAt: new Date() },
  });

  await Ticket.findByIdAndUpdate(ticketId, {
    $push: { messages: { role: "assistant", content: aiResponse } },
    $set: { updatedAt: new Date() },
  });

  return NextResponse.json({ response: aiResponse });
}