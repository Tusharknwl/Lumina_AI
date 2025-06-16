import mongoose from "mongoose";

const ChatSessionSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  title: { type: String, default: "New Chat" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.ChatSession ||
  mongoose.model("ChatSession", ChatSessionSchema);
