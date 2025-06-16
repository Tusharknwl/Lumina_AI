import { NextRequest, NextResponse } from "next/server";
import ChatMessage from "@/models/ChatMessage";
import dbConnect from "@/lib/mongodb";

// GET: Fetch all messages for a session
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const messages = await ChatMessage.find({ session_id: sessionId })
      .sort({ created_at: 1 })
      .lean();

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new chat message
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { session_id, role, content } = body;

    if (!session_id || !role || !content) {
      return NextResponse.json(
        { error: "Session ID, role, and content are required" },
        { status: 400 }
      );
    }

    if (!["user", "assistant"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const newMessage = new ChatMessage({
      session_id,
      role,
      content,
    });

    const savedMessage = await newMessage.save();
    return NextResponse.json(savedMessage);
  } catch (error) {
    console.error("Error creating chat message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
