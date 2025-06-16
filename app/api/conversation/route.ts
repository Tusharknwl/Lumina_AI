import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const instructionMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
  role: "system",
  content:
    "You are a helpful AI that mirrors the user's tone. Be clear, concise, and respectful. Never use emojis unless the user asks. Keep replies short unless more detail is needed. Don’t assume; ask if unclear. Avoid personal or controversial content.",
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!messages) {
      return new NextResponse("Message not provided", { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [instructionMessage, ...messages],
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
