import React, { useEffect, useCallback } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  setCurrentSessionId,
  setSessions,
  addSession,
  removeSession,
  updateSessionTitle as updateSessionTitleAction,
} from "@/lib/redux/features/chatSessionSlice";

interface ChatSession {
  _id: string;
  user_id: string;
  title: string;
  created_at: string;
}

interface ChatHistorySidebarProps {
  open: boolean;
  onClose: () => void;
  currentSessionId: string | null;
  onSessionChange: (sessionId: string) => void;
  onNewSession: () => void;
  children?: React.ReactNode;
}

interface ChatHistoryHandle {
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
  loadChatSessions: () => Promise<void>;
}

const ChatHistorySidebar = React.forwardRef<
  ChatHistoryHandle,
  ChatHistorySidebarProps
>(
  (
    {
      open,
      onClose,
      currentSessionId,
      onSessionChange,
      onNewSession,
      children,
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const { user } = useUser();
    const userId = user?.id || "";
    const dispatch = useDispatch();
    const sessions = useSelector(
      (state: RootState) => state.chatSession.sessions
    );

    // Load all chat sessions for the user
    const loadChatSessions = useCallback(async () => {
      if (!userId) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `/api/chat-sessions?user_id=${userId}`
        );
        dispatch(setSessions(response.data));
      } catch (error) {
        console.error("Error loading chat sessions:", error);
        setError("Failed to load chat sessions");
      } finally {
        setIsLoading(false);
      }
    }, [userId]);

    // Load chat sessions when component mounts or user changes
    useEffect(() => {
      if (userId && open) {
        loadChatSessions();
      }
    }, [userId, open, loadChatSessions]);

    // Create a new chat session
    const handleNewSession = async () => {
      if (!userId) return;

      try {
        const response = await axios.post("/api/chat-sessions", {
          user_id: userId,
          title: "New Chat",
        });
        const newSession = response.data;
        dispatch(addSession(newSession));
        onNewSession();
        dispatch(setCurrentSessionId(newSession._id));
        onSessionChange(newSession._id);
        onClose();
      } catch (error) {
        console.error("Error creating new session:", error);
        setError("Failed to create new session");
      }
    };

    // Delete a chat session
    const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
      e.stopPropagation();

      try {
        await axios.delete(`/api/chat-sessions/${sessionId}`);
        dispatch(removeSession(sessionId));

        // If deleted session was current, handle session switch
        if (currentSessionId === sessionId) {
          if (sessions.length > 1) {
            const nextSession = sessions.find((s) => s._id !== sessionId);
            if (nextSession) {
              dispatch(setCurrentSessionId(nextSession._id));
              onSessionChange(nextSession._id);
            }
          } else {
            dispatch(setCurrentSessionId(null));
            onSessionChange("");
          }
        }
      } catch (error) {
        console.error("Error deleting session:", error);
        setError("Failed to delete session");
      }
    };

    const switchSession = (sessionId: string) => {
      console.log("Switching to session:", sessionId);
      dispatch(setCurrentSessionId(sessionId));
      onSessionChange(sessionId);
      onClose();
    };

    // Update session title
    const updateSessionTitle = useCallback(
      async (sessionId: string, title: string) => {
        try {
          await axios.put(`/api/chat-sessions/${sessionId}`, { title });
          dispatch(updateSessionTitleAction({ sessionId, title }));
        } catch (error) {
          console.error("Error updating session title:", error);
          setError("Failed to update session title");
        }
      },
      []
    );

    // Expose these functions to parent component
    React.useImperativeHandle(
      ref,
      () => ({
        updateSessionTitle,
        loadChatSessions,
      }),
      [updateSessionTitle, loadChatSessions]
    );

    return (
      <>
        {/* Overlay for mobile and desktop */}
        {open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-[100]"
            onClick={onClose}
          />
        )}
        <div
          className={`fixed top-0 left-0 h-full w-full md:w-72 bg-[#111827] shadow-lg z-[101] transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          } ${open ? "" : "pointer-events-none"}`}
        >
          <div className="flex items-center justify-between p-4 border-b border-zinc-700">
            <h2 className="text-lg font-semibold text-white">Chat History</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors duration-200 p-1"
              aria-label="Close chat history"
            >
              ✕
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-b border-zinc-700">
            <Button
              onClick={handleNewSession}
              disabled={!userId || isLoading}
              className="w-full flex items-center gap-2 bg-violet-500 hover:bg-violet-600 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border-b border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-300 text-xs hover:text-red-200 mt-1"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Chat Sessions List */}
          <div className="p-2 overflow-y-auto h-[calc(100%-128px)]">
            {isLoading ? (
              <div className="text-zinc-400 text-sm p-4 text-center">
                Loading chat history...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-zinc-400 text-sm p-4 text-center">
                No chat history yet. Start a new conversation!
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session._id}
                  className={cn(
                    "group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors mb-1",
                    currentSessionId === session._id
                      ? "bg-violet-600 text-white"
                      : "hover:bg-zinc-700 text-zinc-300"
                  )}
                  onClick={() => switchSession(session._id)}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span
                    className="flex-1 text-sm truncate"
                    title={session.title}
                  >
                    {session.title}
                  </span>
                  <Button
                    onClick={(e) => deleteSession(session._id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 h-auto w-auto bg-transparent hover:bg-red-500 text-red-400 hover:text-white transition-opacity"
                    aria-label={`Delete ${session.title}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Additional content from children prop */}
          {children && (
            <div className="p-4 border-t border-zinc-700">{children}</div>
          )}
        </div>
      </>
    );
  }
);

// Add display name for better debugging
ChatHistorySidebar.displayName = "ChatHistorySidebar";

export default ChatHistorySidebar;
