import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Ticket from "@/db/models/Ticket";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const tickets = await Ticket.find({ userId: session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { subject, category, description } = await request.json();
  const ticket = await Ticket.create({
    userId: session.user.id,
    subject,
    category,
    description,
  });

  return NextResponse.json(ticket, { status: 201 });
}