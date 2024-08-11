import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/authConfig";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    // Combine all messages into a single text
    const text = messages.map((m) => `${m.role}: ${m.content}`).join("\n");

    // Use OpenAI to generate a title
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates short, simple title for conversations.",
        },
        {
          role: "user",
          content: `Generate a short, simple title for this conversation:\n\n${text}\n\nTitle:`,
        },
      ],
      max_tokens: 60,
      n: 1,
      temperature: 0.7,
    });

    const result = await response.json();

    if (!result.choices || result.choices.length === 0) {
      throw new Error("No choices returned from OpenAI API");
    }

    const title = result.choices[0].message?.content?.trim();

    if (!title) {
      throw new Error("No title generated from OpenAI API");
    }

    return NextResponse.json({ title });
  } catch (error: any) {
    console.error("Failed to generate title:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
