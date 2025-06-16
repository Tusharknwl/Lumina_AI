import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
// import { OpenAIApi } from "openai.v4";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // if(!configuration.apiKey) {
    //     return new NextResponse("OpenAI API Key not configured ", { status: 500 });
    // }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const response = await openai.images.generate({
      //update in c4
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
