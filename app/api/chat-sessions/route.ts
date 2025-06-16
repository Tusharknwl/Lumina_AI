import { NextRequest, NextResponse } from "next/server";
import ChatSession from "@/models/ChatSession";
import dbConnect from "@/lib/mongodb";

// GET: Fetch all sessions for a user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const sessions = await ChatSession.find({ user_id: userId })
      .sort({ created_at: -1 })
      .lean();

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new chat session
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { user_id, title } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const newSession = new ChatSession({
      user_id,
      title: title || "New Chat",
    });

    const savedSession = await newSession.save();
    return NextResponse.json(savedSession);
  } catch (error) {
    console.error("Error creating chat session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
