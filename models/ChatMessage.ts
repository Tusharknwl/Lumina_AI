import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
  session_id: { type: String, required: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.ChatMessage ||
  mongoose.model("ChatMessage", ChatMessageSchema);
