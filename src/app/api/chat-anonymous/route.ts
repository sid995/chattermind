import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const aiResponse = completion.choices[0].message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}