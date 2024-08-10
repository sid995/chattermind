// app/api/chat/route.ts
import { Configuration, OpenAIApi } from "openai-edge";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/utils/context";
import { NextResponse } from "next/server";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log({ req, data });
    return NextResponse.json({ status: "OK" });

    const { messages } = await req.json();
    // Get the last message
    const lastMessage = messages[messages.length - 1];

    // Get the context from the last message
    const context = await getContext(lastMessage.content, "headstarter");

    const prompt = [
      {
        role: "system",
        content: `You are JDP, the Headstarter AI support bot. Help users with questions about the Headstarter fellowship. Use the following details to guide your responses:

**Headstarter Overview:**
- **Track A: The Entrepreneur Track** - Focus on entrepreneurial projects and criteria like user engagement and revenue.
- **Track B: The Tech Leader Track** - Develop leadership skills through startup interactions and project contributions.
- **Track C: The Individual Contributor Track** - Contribute to open-source projects and gain recognition.

**Guidelines:**
- Be patient and offer multiple solutions.
- Avoid making promises.
- If a question does not relate to Headstarter or is unclear, kindly inform the user that you can only assist with Headstarter-related inquiries.

**Context Handling:**
- Consider the previous messages in the conversation history to provide relevant and coherent responses.
- Ensure that each response builds upon the context provided by the user's previous messages.

**Language Handling:**
- Detect the language of the user's message.
- If the message is in a foreign language, translate your response to match the language of the user's message.
- If translation is not possible, inform the user and continue in the language used in the last known message.

START CONTEXT BLOCK
${context}
END OF CONTEXT BLOCK

Take into account any CONTEXT BLOCK that is provided in a conversation.
If the context does not provide the answer to a question, say, "I'm sorry, but I don't have specific information about that aspect of Headstarter. Could you please ask about another topic or rephrase your question?"
Do not invent information that is not provided in the context or your base knowledge about Headstarter.
`,
      },
    ];

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        ...prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
    });

    // Check if the response or its properties are undefined
    if (!response || !response.body) {
      throw new Error("Received an empty response from OpenAI");
    }

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (e) {
    console.error("Error in chat API:", e);
    return new Response(
      JSON.stringify({ error: "An error occurred during the chat process" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
