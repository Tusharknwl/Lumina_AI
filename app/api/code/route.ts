import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

const instructionMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
    role: "system",
    content: "You are a code generator. You are given a description of a function or a code snippet. You must generate the rest of the function. You must answer only in markdown code snippets. Use code comments for explanations. And explain your code in natural language. with other nessacary details."
}

export async function POST (
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }   

        if(!messages) {
            return new NextResponse("Message not provided", { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        });

        return NextResponse.json(response.choices[0].message);

    } catch (error) {
        console.log("[CODE_ERROR]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}