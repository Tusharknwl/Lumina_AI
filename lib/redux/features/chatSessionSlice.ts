import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatSessionState {
  currentSessionId: string | null;
  sessions: {
    _id: string;
    user_id: string;
    title: string;
    created_at: string;
  }[];
}

const initialState: ChatSessionState = {
  currentSessionId: null,
  sessions: [],
};

export const chatSessionSlice = createSlice({
  name: "chatSession",
  initialState,
  reducers: {
    setCurrentSessionId: (state, action: PayloadAction<string | null>) => {
      state.currentSessionId = action.payload;
    },
    setSessions: (
      state,
      action: PayloadAction<ChatSessionState["sessions"]>
    ) => {
      state.sessions = action.payload;
    },
    addSession: (
      state,
      action: PayloadAction<ChatSessionState["sessions"][0]>
    ) => {
      state.sessions.unshift(action.payload);
    },
    removeSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(
        (session) => session._id !== action.payload
      );
      if (state.currentSessionId === action.payload) {
        state.currentSessionId =
          state.sessions.length > 0 ? state.sessions[0]._id : null;
      }
    },
    updateSessionTitle: (
      state,
      action: PayloadAction<{ sessionId: string; title: string }>
    ) => {
      const session = state.sessions.find(
        (s) => s._id === action.payload.sessionId
      );
      if (session) {
        session.title = action.payload.title;
      }
    },
  },
});

export const {
  setCurrentSessionId,
  setSessions,
  addSession,
  removeSession,
  updateSessionTitle,
} = chatSessionSlice.actions;

export default chatSessionSlice.reducer;
