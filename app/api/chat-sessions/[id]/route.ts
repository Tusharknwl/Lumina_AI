import { NextRequest, NextResponse } from "next/server";
import ChatSession from "@/models/ChatSession";
import ChatMessage from "@/models/ChatMessage";
import dbConnect from "@/lib/mongodb";

// PUT: Update a chat session
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params;
    console.log("Updating session with ID:", id);
    const body = await request.json();
    const { title } = body;

    const updatedSession = await ChatSession.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!updatedSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating chat session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a chat session and all its messages
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params;
    console.log("Deleting session with ID:", id);

    // Delete all messages in this session first
    await ChatMessage.deleteMany({ session_id: id });

    // Delete the session
    const deletedSession = await ChatSession.findByIdAndDelete(id);

    if (!deletedSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
