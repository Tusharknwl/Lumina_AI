// "use client";

// import axios from "axios";
// import * as z from "zod";
// import {
//   MessageSquare,
//   Send,
//   Sparkles,
//   Plus,
//   History,
//   Trash2,
// } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useState, useRef, useEffect } from "react";
// import OpenAI from "openai";
// import ReactMarkdown from "react-markdown";
// import { useUser } from "@clerk/nextjs";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/lib/redux/store";
// import {
//   setCurrentSessionId,
//   setSessions,
// } from "@/lib/redux/features/chatSessionSlice";

// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Loader } from "@/components/loader";

// import { cn } from "@/lib/utils";
// import { formSchema } from "./constants";
// import { UserAvatar } from "@/components/ui/user-avatar";
// import { BotAvatar } from "@/components/ui/bot-avatar";

// // Types for our session-based chat
// interface ChatSession {
//   _id: string;
//   user_id: string;
//   title: string;
//   created_at: string;
// }

// interface ChatMessage {
//   _id: string;
//   session_id: string;
//   role: "user" | "assistant";
//   content: string;
//   created_at: string;
// }

// const ConversationPage = () => {
//   const router = useRouter();
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [sessions, setSessions] = useState<ChatSession[]>([]);
//   const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [isLoadingMessages, setIsLoadingMessages] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   // Get user ID from Clerk auth
//   const { user } = useUser();
//   const userId = user?.id || "";
//   console.log("User ID:", userId);
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       prompt: "",
//     },
//   });

//   const isLoading = form.formState.isSubmitting;

//   // Load chat sessions on component mount
//   useEffect(() => {
//     if (userId) {
//       loadChatSessions();
//     }
//   }, [userId]);

//   // Load messages when session changes
//   useEffect(() => {
//     if (currentSessionId) {
//       loadChatMessages(currentSessionId);
//     }
//   }, [currentSessionId]);

//   // Auto-scroll to bottom when new messages arrive
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Load all chat sessions for the user
//   const loadChatSessions = async () => {
//     try {
//       const response = await axios.get(`/api/chat-sessions?user_id=${userId}`);
//       setSessions(response.data);

//       // If no current session and sessions exist, select the most recent one
//       if (!currentSessionId && response.data.length > 0) {
//         setCurrentSessionId(response.data[0]._id);
//       }
//     } catch (error) {
//       console.error("Error loading chat sessions:", error);
//     }
//   };

//   // Load messages for a specific session
//   const loadChatMessages = async (sessionId: string) => {
//     setIsLoadingMessages(true);
//     try {
//       const response = await axios.get(
//         `/api/chat-messages?session_id=${sessionId}`
//       );
//       setMessages(response.data);
//     } catch (error) {
//       console.error("Error loading chat messages:", error);
//       setMessages([]);
//     } finally {
//       setIsLoadingMessages(false);
//     }
//   };

//   // Create a new chat session
//   const createNewSession = async () => {
//     try {
//       const response = await axios.post("/api/chat-sessions", {
//         user_id: userId,
//         title: "New Chat",
//       });

//       const newSession = response.data;
//       setSessions((prev) => [newSession, ...prev]);
//       setCurrentSessionId(newSession._id);
//       setMessages([]);
//       setShowSidebar(false);
//     } catch (error) {
//       console.error("Error creating new session:", error);
//     }
//   };

//   // Delete a chat session
//   const deleteSession = async (sessionId: string) => {
//     try {
//       await axios.delete(`/api/chat-sessions/${sessionId}`);
//       setSessions((prev) =>
//         prev.filter((session) => session._id !== sessionId)
//       );

//       // If deleted session was current, switch to another or create new
//       if (currentSessionId === sessionId) {
//         const remainingSessions = sessions.filter(
//           (session) => session._id !== sessionId
//         );
//         if (remainingSessions.length > 0) {
//           setCurrentSessionId(remainingSessions[0]._id);
//         } else {
//           setCurrentSessionId(null);
//           setMessages([]);
//         }
//       }
//     } catch (error) {
//       console.error("Error deleting session:", error);
//     }
//   };

//   // Update session title based on first message
//   const updateSessionTitle = async (
//     sessionId: string,
//     firstMessage: string
//   ) => {
//     try {
//       // Generate a title from the first message (first 50 characters)
//       const title =
//         firstMessage.length > 50
//           ? firstMessage.substring(0, 50) + "..."
//           : firstMessage;

//       await axios.put(`/api/chat-sessions/${sessionId}`, { title });

//       // Update local state
//       setSessions((prev) =>
//         prev.map((session) =>
//           session._id === sessionId ? { ...session, title } : session
//         )
//       );
//     } catch (error) {
//       console.error("Error updating session title:", error);
//     }
//   };

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       let sessionId = currentSessionId;

//       // Create new session if none exists
//       if (!sessionId) {
//         const sessionResponse = await axios.post("/api/chat-sessions", {
//           user_id: userId,
//           title: "New Chat",
//         });
//         sessionId = sessionResponse.data._id;
//         setCurrentSessionId(sessionId);
//         setSessions((prev) => [sessionResponse.data, ...prev]);
//       }

//       // Save user message
//       const userMessageResponse = await axios.post("/api/chat-messages", {
//         session_id: sessionId,
//         role: "user",
//         content: values.prompt,
//       });

//       const userMessage = userMessageResponse.data;

//       // Update local messages with user message
//       setMessages((prev) => [...prev, userMessage]);

//       // Get AI response
//       const conversationResponse = await axios.post("/api/conversation", {
//         messages: [...messages, { role: "user", content: values.prompt }],
//       });

//       // Save assistant message
//       const assistantMessageResponse = await axios.post("/api/chat-messages", {
//         session_id: sessionId,
//         role: "assistant",
//         content: conversationResponse.data.content,
//       });

//       const assistantMessage = assistantMessageResponse.data;

//       // Update local messages with assistant message
//       setMessages((prev) => [...prev, assistantMessage]);

//       // Update session title if this is the first message in the session
//       if (messages.length === 0 && sessionId) {
//         updateSessionTitle(sessionId, values.prompt);
//       }

//       form.reset();

//       // Reset textarea height
//       if (textareaRef.current) {
//         textareaRef.current.style.height = "auto";
//       }
//     } catch (error: any) {
//       console.error("Error in onSubmit:", error);
//     } finally {
//       router.refresh();
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       form.handleSubmit(onSubmit)();
//     }
//   };

//   const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
//     const target = e.target as HTMLTextAreaElement;
//     target.style.height = "auto";
//     target.style.height = Math.min(target.scrollHeight, 128) + "px";
//   };

//   const suggestedPrompts = [
//     "Help me write a professional email",
//     "Explain a complex topic simply",
//     "Create a marketing strategy",
//     "Tell me a joke",
//   ];

//   const handleSuggestedPrompt = (prompt: string) => {
//     form.setValue("prompt", prompt);
//     textareaRef.current?.focus();
//   };

//   const switchSession = (sessionId: string) => {
//     setCurrentSessionId(sessionId);
//     setShowSidebar(false);
//   };

//   return (
//     <div className="flex h-[90vh] bg-white">
//       {/* Sidebar */}
//       <div
//         className={cn(
//           "w-64 bg-gray-50 border-r border-gray-200 flex flex-col transition-transform duration-300",
//           showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         )}
//       >
//         {/* Sidebar Header */}
//         <div className="p-4 border-b border-gray-200">
//           <Button
//             onClick={createNewSession}
//             className="w-full flex items-center gap-2 bg-violet-500 hover:bg-violet-600"
//           >
//             <Plus className="w-4 h-4" />
//             New Chat
//           </Button>
//         </div>

//         {/* Chat Sessions List */}
//         <div className="flex-1 overflow-y-auto p-2">
//           {sessions.map((session) => (
//             <div
//               key={session._id}
//               className={cn(
//                 "group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors mb-1",
//                 currentSessionId === session._id
//                   ? "bg-violet-100 text-violet-700"
//                   : "hover:bg-gray-100"
//               )}
//               onClick={() => switchSession(session._id)}
//             >
//               <MessageSquare className="w-4 h-4 flex-shrink-0" />
//               <span className="flex-1 text-sm truncate">{session.title}</span>
//               <Button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   deleteSession(session._id);
//                 }}
//                 className="opacity-0 group-hover:opacity-100 p-1 h-auto w-auto bg-transparent hover:bg-red-100 text-red-500"
//               >
//                 <Trash2 className="w-3 h-3" />
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         {/* <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
//           <Button
//             onClick={() => setShowSidebar(!showSidebar)}
//             className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 z-50"
//           >
//             <History className="w-5 h-5" />
//             <span className="sr-only">Toggle Sidebar</span>
//           </Button>
//           <h1 className="font-semibold text-gray-900">Lumina AI</h1>
//           <div className="w-9" />
//         </div> */}

//         {/* Messages Area */}
//         <div className="flex-1 overflow-y-auto">
//           {isLoadingMessages ? (
//             <div className="flex items-center justify-center h-full">
//               <Loader />
//             </div>
//           ) : messages.length === 0 && !isLoading ? (
//             /* Welcome Screen */
//             <div className="flex flex-col items-center justify-center h-full px-4 max-w-2xl mx-auto">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
//                 Welcome to Lumina AI
//               </h2>
//               <p className="text-gray-600 text-center mb-8 max-w-md">
//                 I'm here to help you with questions, creative tasks, analysis,
//                 and more. What would you like to explore today?
//               </p>

//               {/* Suggested Prompts */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
//                 {suggestedPrompts.map((prompt, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleSuggestedPrompt(prompt)}
//                     className="p-3 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors duration-200 hover:border-gray-300"
//                   >
//                     {prompt}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             /* Messages */
//             <div className="max-w-4xl mx-auto w-full px-4 py-6">
//               {messages.map((message, index) => (
//                 <div
//                   key={message._id}
//                   className={cn(
//                     "flex gap-4 mb-6",
//                     message.role === "user" ? "flex-row-reverse" : "flex-row"
//                   )}
//                 >
//                   {/* Avatar */}
//                   <div className="flex-shrink-0">
//                     {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
//                   </div>

//                   {/* Message Content */}
//                   <div
//                     className={cn(
//                       "flex-1 max-w-[85%]",
//                       message.role === "user" ? "text-right" : "text-left"
//                     )}
//                   >
//                     <div
//                       className={cn(
//                         "inline-block p-4 rounded-2xl prose prose-sm max-w-none",
//                         message.role === "user"
//                           ? "bg-blue-500 text-white rounded-br-md prose-invert"
//                           : "bg-gray-100 text-gray-900 rounded-bl-md"
//                       )}
//                     >
//                       <ReactMarkdown className="text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
//                         {message.content}
//                       </ReactMarkdown>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* Loading indicator */}
//               {isLoading && (
//                 <div className="flex gap-4 mb-6">
//                   <div className="flex-shrink-0">
//                     <BotAvatar />
//                   </div>
//                   <div className="flex-1">
//                     <div className="inline-block p-4 bg-gray-100 rounded-2xl rounded-bl-md">
//                       <div className="flex gap-1">
//                         <div
//                           className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                           style={{ animationDelay: "0ms" }}
//                         ></div>
//                         <div
//                           className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                           style={{ animationDelay: "150ms" }}
//                         ></div>
//                         <div
//                           className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                           style={{ animationDelay: "300ms" }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>
//           )}
//         </div>

//         {/* Input Area - Sticky Bottom */}
//         <div className="border-t border-gray-200 bg-white p-4">
//           <div className="max-w-4xl mx-auto">
//             <Form {...form}>
//               <div className="relative">
//                 <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100 transition-all duration-200">
//                   <FormField
//                     name="prompt"
//                     render={({ field }) => (
//                       <FormItem className="flex-1">
//                         <FormControl className="m-0 p-0">
//                           <textarea
//                             {...field}
//                             ref={textareaRef}
//                             onKeyDown={handleKeyDown}
//                             onInput={handleTextareaInput}
//                             placeholder="Message Lumina AI..."
//                             className="flex-1 bg-transparent border-0 outline-none resize-none px-4 py-3 text-sm placeholder-gray-500 max-h-32 min-h-[44px] w-full rounded-2xl focus:ring-0 focus-visible:ring-0 focus-visible:border-transparent"
//                             rows={1}
//                             disabled={isLoading}
//                             style={{
//                               scrollbarWidth: "thin",
//                               scrollbarColor: "#CBD5E1 transparent",
//                             }}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                   <Button
//                     onClick={form.handleSubmit(onSubmit)}
//                     disabled={!form.watch("prompt")?.trim() || isLoading}
//                     className="m-2 p-2 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0 h-10 w-10"
//                     size="sm"
//                   >
//                     <Send className="w-4 h-4 text-white" />
//                   </Button>
//                 </div>
//               </div>
//             </Form>

//             {/* Footer text */}
//             <p className="text-xs text-gray-500 text-center mt-3">
//               Lumina AI can make mistakes. Please verify important information.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Mobile overlay */}
//       {showSidebar && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={() => setShowSidebar(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default ConversationPage;

// "use client";

// import axios from "axios";
// import * as z from "zod";
// import { MessageSquare, Plus, Send, Trash2 } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useState, useRef, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import { useUser } from "@clerk/nextjs";

// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Loader } from "@/components/loader";

// import { cn } from "@/lib/utils";
// import { formSchema } from "./constants";
// import { UserAvatar } from "@/components/ui/user-avatar";
// import { BotAvatar } from "@/components/ui/bot-avatar";

// interface ChatSession {
//   _id: string;
//   user_id: string;
//   title: string;
//   created_at: string;
// }

// interface ChatMessage {
//   _id: string;
//   session_id: string;
//   role: "user" | "assistant";
//   content: string;
//   created_at: string;
// }

// const ConversationPage = () => {
//   const router = useRouter();
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [sessions, setSessions] = useState<ChatSession[]>([]);
//   const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [isLoadingMessages, setIsLoadingMessages] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   // Get user ID from Clerk auth
//   const { user } = useUser();
//   const userId = user?.id || "";
//   console.log("User ID:", userId);
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       prompt: "",
//     },
//   });

//   const isLoading = form.formState.isSubmitting;

//   // Load chat sessions on component mount
//   useEffect(() => {
//     if (userId) {
//       loadChatSessions();
//     }
//   }, [userId]);

//   // Load messages when session changes
//   useEffect(() => {
//     if (currentSessionId) {
//       loadChatMessages(currentSessionId);
//     }
//   }, [currentSessionId]);

//   // Auto-scroll to bottom when new messages arrive
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Load all chat sessions for the user
//   const loadChatSessions = async () => {
//     try {
//       const response = await axios.get(`/api/chat-sessions?user_id=${userId}`);
//       setSessions(response.data);

//       // If no current session and sessions exist, select the most recent one
//       if (!currentSessionId && response.data.length > 0) {
//         setCurrentSessionId(response.data[0]._id);
//       }
//     } catch (error) {
//       console.error("Error loading chat sessions:", error);
//     }
//   };

//   // Load messages for a specific session
//   const loadChatMessages = async (sessionId: string) => {
//     setIsLoadingMessages(true);
//     try {
//       const response = await axios.get(
//         `/api/chat-messages?session_id=${sessionId}`
//       );
//       setMessages(response.data);
//     } catch (error) {
//       console.error("Error loading chat messages:", error);
//       setMessages([]);
//     } finally {
//       setIsLoadingMessages(false);
//     }
//   };

//   // Create a new chat session
//   const createNewSession = async () => {
//     try {
//       const response = await axios.post("/api/chat-sessions", {
//         user_id: userId,
//         title: "New Chat",
//       });

//       const newSession = response.data;
//       setSessions((prev) => [newSession, ...prev]);
//       setCurrentSessionId(newSession._id);
//       setMessages([]);
//       setShowSidebar(false);
//     } catch (error) {
//       console.error("Error creating new session:", error);
//     }
//   };

//   // Delete a chat session
//   const deleteSession = async (sessionId: string) => {
//     try {
//       await axios.delete(`/api/chat-sessions/${sessionId}`);
//       setSessions((prev) =>
//         prev.filter((session) => session._id !== sessionId)
//       );

//       // If deleted session was current, switch to another or create new
//       if (currentSessionId === sessionId) {
//         const remainingSessions = sessions.filter(
//           (session) => session._id !== sessionId
//         );
//         if (remainingSessions.length > 0) {
//           setCurrentSessionId(remainingSessions[0]._id);
//         } else {
//           setCurrentSessionId(null);
//           setMessages([]);
//         }
//       }
//     } catch (error) {
//       console.error("Error deleting session:", error);
//     }
//   };

//   // Update session title based on first message
//   const updateSessionTitle = async (
//     sessionId: string,
//     firstMessage: string
//   ) => {
//     try {
//       // Generate a title from the first message (first 50 characters)
//       const title =
//         firstMessage.length > 50
//           ? firstMessage.substring(0, 50) + "..."
//           : firstMessage;

//       await axios.put(`/api/chat-sessions/${sessionId}`, { title });

//       // Update local state
//       setSessions((prev) =>
//         prev.map((session) =>
//           session._id === sessionId ? { ...session, title } : session
//         )
//       );
//     } catch (error) {
//       console.error("Error updating session title:", error);
//     }
//   };

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       let sessionId = currentSessionId;

//       // Create new session if none exists
//       if (!sessionId) {
//         const sessionResponse = await axios.post("/api/chat-sessions", {
//           user_id: userId,
//           title: "New Chat",
//         });
//         sessionId = sessionResponse.data._id;
//         setCurrentSessionId(sessionId);
//         setSessions((prev) => [sessionResponse.data, ...prev]);
//       }

//       // Save user message
//       const userMessageResponse = await axios.post("/api/chat-messages", {
//         session_id: sessionId,
//         role: "user",
//         content: values.prompt,
//       });

//       const userMessage = userMessageResponse.data;

//       // Update local messages with user message
//       setMessages((prev) => [...prev, userMessage]);

//       // Get AI response
//       const conversationResponse = await axios.post("/api/conversation", {
//         messages: [...messages, { role: "user", content: values.prompt }],
//       });

//       // Save assistant message
//       const assistantMessageResponse = await axios.post("/api/chat-messages", {
//         session_id: sessionId,
//         role: "assistant",
//         content: conversationResponse.data.content,
//       });

//       const assistantMessage = assistantMessageResponse.data;

//       // Update local messages with assistant message
//       setMessages((prev) => [...prev, assistantMessage]);

//       // Update session title if this is the first message in the session
//       if (messages.length === 0 && sessionId) {
//         updateSessionTitle(sessionId, values.prompt);
//       }

//       form.reset();

//       // Reset textarea height
//       if (textareaRef.current) {
//         textareaRef.current.style.height = "auto";
//       }
//     } catch (error: any) {
//       console.error("Error in onSubmit:", error);
//     } finally {
//       router.refresh();
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       form.handleSubmit(onSubmit)();
//     }
//   };

//   const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
//     const target = e.target as HTMLTextAreaElement;
//     target.style.height = "auto";
//     target.style.height = Math.min(target.scrollHeight, 128) + "px";
//   };

//   const suggestedPrompts = [
//     "Help me write a professional email",
//     "Explain a complex topic simply",
//     "Create a marketing strategy",
//     "Tell me a joke",
//   ];

//   const handleSuggestedPrompt = (prompt: string) => {
//     form.setValue("prompt", prompt);
//     textareaRef.current?.focus();
//   };

//   const switchSession = (sessionId: string) => {
//     setCurrentSessionId(sessionId);
//     setShowSidebar(false);
//   };

//   return (
//     <div className="flex h-[90vh] bg-white">
//       {/* Sidebar */}
//       <div
//         className={cn(
//           "w-64 bg-gray-50 border-r border-gray-200 flex flex-col transition-transform duration-300",
//           showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         )}
//       >
//         {/* Sidebar Header */}
//         <div className="p-4 border-b border-gray-200">
//           <Button
//             onClick={createNewSession}
//             className="w-full flex items-center gap-2 bg-violet-500 hover:bg-violet-600"
//           >
//             <Plus className="w-4 h-4" />
//             New Chat
//           </Button>
//         </div>

//         {/* Chat Sessions List */}
//         <div className="flex-1 overflow-y-auto p-2">
//           {sessions.map((session) => (
//             <div
//               key={session._id}
//               className={cn(
//                 "group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors mb-1",
//                 currentSessionId === session._id
//                   ? "bg-violet-100 text-violet-700"
//                   : "hover:bg-gray-100"
//               )}
//               onClick={() => switchSession(session._id)}
//             >
//               <MessageSquare className="w-4 h-4 flex-shrink-0" />
//               <span className="flex-1 text-sm truncate">{session.title}</span>
//               <Button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   deleteSession(session._id);
//                 }}
//                 className="opacity-0 group-hover:opacity-100 p-1 h-auto w-auto bg-transparent hover:bg-red-100 text-red-500"
//               >
//                 <Trash2 className="w-3 h-3" />
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Messages Area */}
//         <div className="flex-1 overflow-y-auto">
//           {isLoadingMessages ? (
//             <div className="flex items-center justify-center h-full">
//               <Loader />
//             </div>
//           ) : messages.length === 0 && !isLoading ? (
//             /* Welcome Screen */
//             <div className="flex flex-col items-center justify-center h-full px-4 max-w-2xl mx-auto">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
//                 Welcome to Lumina AI
//               </h2>
//               <p className="text-gray-600 text-center mb-8 max-w-md">
//                 I'm here to help you with questions, creative tasks, analysis,
//                 and more. What would you like to explore today?
//               </p>

//               {/* Suggested Prompts */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
//                 {suggestedPrompts.map((prompt, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleSuggestedPrompt(prompt)}
//                     className="p-3 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors duration-200 hover:border-gray-300"
//                   >
//                     {prompt}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             /* Messages */
//             <div className="max-w-4xl mx-auto w-full px-4 py-6">
//               {messages.map((message, index) => (
//                 <div
//                   key={message._id}
//                   className={cn(
//                     "flex gap-4 mb-6",
//                     message.role === "user" ? "flex-row-reverse" : "flex-row"
//                   )}
//                 >
//                   {/* Avatar */}
//                   <div className="flex-shrink-0">
//                     {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
//                   </div>

//                   {/* Message Content */}
//                   <div
//                     className={cn(
//                       "flex-1 max-w-[85%]",
//                       message.role === "user" ? "text-right" : "text-left"
//                     )}
//                   >
//                     <div
//                       className={cn(
//                         "inline-block p-4 rounded-2xl prose prose-sm max-w-none",
//                         message.role === "user"
//                           ? "bg-blue-500 text-white rounded-br-md prose-invert"
//                           : "bg-gray-100 text-gray-900 rounded-bl-md"
//                       )}
//                     >
//                       <ReactMarkdown className="text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
//                         {message.content}
//                       </ReactMarkdown>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* Loading indicator */}
//               {isLoading && (
//                 <div className="flex gap-4 mb-6">
//                   <div className="flex-shrink-0">
//                     <BotAvatar />
//                   </div>
//                   <div className="flex-1">
//                     <div className="inline-block p-4 bg-gray-100 rounded-2xl rounded-bl-md">
//                       <div className="flex gap-1">
//                         <div
//                           className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                           style={{ animationDelay: "0ms" }}
//                         ></div>
//                         <div
//                           className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                           style={{ animationDelay: "150ms" }}
//                         ></div>
//                         <div
//                           className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                           style={{ animationDelay: "300ms" }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>
//           )}
//         </div>

//         {/* Input Area - Sticky Bottom */}
//         <div className="border-t border-gray-200 bg-white p-4">
//           <div className="max-w-4xl mx-auto">
//             <Form {...form}>
//               <div className="relative">
//                 <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100 transition-all duration-200">
//                   <FormField
//                     name="prompt"
//                     render={({ field }) => (
//                       <FormItem className="flex-1">
//                         <FormControl className="m-0 p-0">
//                           <textarea
//                             {...field}
//                             ref={textareaRef}
//                             onKeyDown={handleKeyDown}
//                             onInput={handleTextareaInput}
//                             placeholder="Message Lumina AI..."
//                             className="flex-1 bg-transparent border-0 outline-none resize-none px-4 py-3 text-sm placeholder-gray-500 max-h-32 min-h-[44px] w-full rounded-2xl focus:ring-0 focus-visible:ring-0 focus-visible:border-transparent"
//                             rows={1}
//                             disabled={isLoading}
//                             style={{
//                               scrollbarWidth: "thin",
//                               scrollbarColor: "#CBD5E1 transparent",
//                             }}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                   <Button
//                     onClick={form.handleSubmit(onSubmit)}
//                     disabled={!form.watch("prompt")?.trim() || isLoading}
//                     className="m-2 p-2 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0 h-10 w-10"
//                     size="sm"
//                   >
//                     <Send className="w-4 h-4 text-white" />
//                   </Button>
//                 </div>
//               </div>
//             </Form>

//             {/* Footer text */}
//             <p className="text-xs text-gray-500 text-center mt-3">
//               Lumina AI can make mistakes. Please verify important information.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Mobile overlay */}
//       {showSidebar && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={() => setShowSidebar(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default ConversationPage;

// ("use client");

// import axios from "axios";
// import * as z from "zod";
// import { Send } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useState, useRef, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import { useUser } from "@clerk/nextjs";

// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Loader } from "@/components/loader";

// import { cn } from "@/lib/utils";
// import { formSchema } from "./constants";
// import { UserAvatar } from "@/components/ui/user-avatar";
// import { BotAvatar } from "@/components/ui/bot-avatar";

// "use client";

// import axios from "axios";
// import * as z from "zod";
// import {
//   MessageSquare,
//   Send,
//   Sparkles,
//   Plus,
//   History,
//   Trash2,
// } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useState, useRef, useEffect } from "react";
// import OpenAI from "openai";
// import ReactMarkdown from "react-markdown";
// import { useUser } from "@clerk/nextjs";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/lib/redux/store";
// import {
//   setCurrentSessionId,
//   setSessions,
// } from "@/lib/redux/features/chatSessionSlice";

// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Loader } from "@/components/loader";

// import { cn } from "@/lib/utils";
// import { formSchema } from "./constants";
// import { UserAvatar } from "@/components/ui/user-avatar";
// import { BotAvatar } from "@/components/ui/bot-avatar";
// interface ChatSession {
//   _id: string;
//   user_id: string;
//   title: string;
//   created_at: string;
// }

// interface ChatMessage {
//   _id: string;
//   session_id: string;
//   role: "user" | "assistant";
//   content: string;
//   created_at: string;
// }

// interface ConversationPageProps {
//   currentSessionId?: string | null;
//   onSessionChange?: (sessionId: string) => void;
// }

// const ConversationPage: React.FC<ConversationPageProps> = ({
//   currentSessionId: propSessionId, // Renamed to avoid naming conflict
//   onSessionChange,
// }) => {
//   console.log("ConversationPage render - propSessionId:", propSessionId);

//   // Redux dispatch and selector
//   const dispatch = useDispatch();
//   const sessions = useSelector(
//     (state: RootState) => state.chatSession.sessions
//   );
//   const currentSessionIdtest = useSelector(
//     (state: RootState) => state.chatSession.currentSessionId
//   );
//   console.log("Redux currentSessionId:", currentSessionIdtest);

//   const router = useRouter();
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
//   const [isLoadingMessages, setIsLoadingMessages] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   // Get user ID from Clerk auth
//   const { user } = useUser();
//   const userId = user?.id || "";

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       prompt: "",
//     },
//   });

//   const isLoading = form.formState.isSubmitting;

//   // Update session ID when prop changes and load messages immediately
//   useEffect(() => {
//     console.log(
//       "Prop session ID changed:",
//       propSessionId,
//       "Current:",
//       currentSessionId
//     );

//     if (propSessionId !== currentSessionId) {
//       setCurrentSessionId(propSessionId || null);

//       // Load messages immediately when session changes
//       if (propSessionId) {
//         console.log("Loading messages for session:", propSessionId);
//         loadChatMessages(propSessionId);
//       } else {
//         console.log("Clearing messages - no session");
//         setMessages([]);
//       }
//     }
//   }, [propSessionId, onSessionChange]); // Remove currentSessionId from deps to avoid circular updates

//   // Auto-scroll to bottom when new messages arrive
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   console.log("Current session ID test:", currentSessionId);

//   // Load messages for a specific session
//   const loadChatMessages = async (sessionId: string) => {
//     if (!sessionId) {
//       console.log("No session ID provided to loadChatMessages");
//       return;
//     }

//     console.log("Loading messages for session:", sessionId);
//     setIsLoadingMessages(true);

//     try {
//       const response = await axios.get(
//         `/api/chat-messages?session_id=${sessionId}`
//       );

//       console.log("Loaded messages:", response.data);
//       setMessages(response.data || []);
//     } catch (error) {
//       console.error("Error loading chat messages:", error);
//       setMessages([]);
//     } finally {
//       setIsLoadingMessages(false);
//     }
//   };

//   // Update session title based on first message
//   const updateSessionTitle = async (
//     sessionId: string,
//     firstMessage: string
//   ) => {
//     try {
//       // Generate a title from the first message (first 50 characters)
//       const title =
//         firstMessage.length > 50
//           ? firstMessage.substring(0, 50) + "..."
//           : firstMessage;

//       await axios.put(`/api/chat-sessions/${sessionId}`, { title });
//     } catch (error) {
//       console.error("Error updating session title:", error);
//     }
//   };

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       let sessionId = currentSessionId;

//       // Create new session if none exists
//       if (!sessionId) {
//         const sessionResponse = await axios.post("/api/chat-sessions", {
//           user_id: userId,
//           title: "New Chat",
//         });
//         sessionId = sessionResponse.data._id;
//         setCurrentSessionId(sessionId);

//         // Notify parent component if callback exists
//         if (onSessionChange && sessionId) {
//           onSessionChange(sessionId);
//         }
//       }

//       // Save user message
//       const userMessageResponse = await axios.post("/api/chat-messages", {
//         session_id: sessionId,
//         role: "user",
//         content: values.prompt,
//       });

//       const userMessage = userMessageResponse.data;

//       // Update local messages with user message immediately
//       setMessages((prev) => [...prev, userMessage]);

//       // Get AI response - use current messages state plus the new user message
//       const currentMessages = [
//         ...messages,
//         { role: "user", content: values.prompt },
//       ];
//       const conversationResponse = await axios.post("/api/conversation", {
//         messages: currentMessages,
//       });

//       // Save assistant message
//       const assistantMessageResponse = await axios.post("/api/chat-messages", {
//         session_id: sessionId,
//         role: "assistant",
//         content: conversationResponse.data.content,
//       });

//       const assistantMessage = assistantMessageResponse.data;

//       // Update local messages with assistant message
//       setMessages((prev) => [...prev, assistantMessage]);

//       // Update session title if this is the first message in the session
//       if (messages.length === 0 && sessionId) {
//         await updateSessionTitle(sessionId, values.prompt);
//       }

//       form.reset();

//       // Reset textarea height
//       if (textareaRef.current) {
//         textareaRef.current.style.height = "auto";
//       }
//     } catch (error: any) {
//       console.error("Error in onSubmit:", error);
//       // Optional: Add user-facing error handling here
//     } finally {
//       router.refresh();
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (form.watch("prompt")?.trim()) {
//         form.handleSubmit(onSubmit)();
//       }
//     }
//   };

//   const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
//     const target = e.target as HTMLTextAreaElement;
//     target.style.height = "auto";
//     target.style.height = Math.min(target.scrollHeight, 128) + "px";
//   };

//   const suggestedPrompts = [
//     "Help me write a professional email",
//     "Explain a complex topic simply",
//     "Create a marketing strategy",
//     "Tell me a joke",
//   ];

//   const handleSuggestedPrompt = (prompt: string) => {
//     form.setValue("prompt", prompt);
//     textareaRef.current?.focus();
//   };

//   return (
//     <div className="flex h-[90vh] bg-white w-full">
//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Messages Area */}
//         <div className="flex-1 overflow-y-auto">
//           {isLoadingMessages ? (
//             <div className="flex items-center justify-center h-full">
//               <Loader />
//             </div>
//           ) : messages.length === 0 && !isLoading ? (
//             /* Welcome Screen */
//             <div className="flex flex-col items-center justify-center h-full px-4 max-w-2xl mx-auto">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
//                 Welcome to Lumina AI
//               </h2>
//               <p className="text-gray-600 text-center mb-8 max-w-md">
//                 I'm here to help you with questions, creative tasks, analysis,
//                 and more. What would you like to explore today?
//               </p>

//               {/* Suggested Prompts */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
//                 {suggestedPrompts.map((prompt, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleSuggestedPrompt(prompt)}
//                     className="p-3 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors duration-200 hover:border-gray-300"
//                   >
//                     {prompt}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             /* Messages */
//             <div className="max-w-4xl mx-auto w-full px-4 py-6">
//               {messages.map((message) => (
//                 <div
//                   key={message._id}
//                   className={cn(
//                     "flex gap-4 mb-6",
//                     message.role === "user" ? "flex-row-reverse" : "flex-row"
//                   )}
//                 >
//                   {/* Avatar */}
//                   <div className="flex-shrink-0">
//                     {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
//                   </div>

//                   {/* Message Content */}
//                   <div
//                     className={cn(
//                       "flex-1 max-w-[85%]",
//                       message.role === "user" ? "text-right" : "text-left"
//                     )}
//                   >
//                     <div
//                       className={cn(
//                         "inline-block p-4 rounded-2xl prose prose-sm max-w-none",
//                         message.role === "user"
//                           ? "bg-blue-500 text-white rounded-br-md prose-invert"
//                           : "bg-gray-100 text-gray-900 rounded-bl-md"
//                       )}
//                     >
//                       <ReactMarkdown className="text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
//                         {message.content}
//                       </ReactMarkdown>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* Loading indicator */}
//               {isLoading && (
//                 <div className="flex gap-4 mb-6">
//                   <div className="flex-shrink-0">
//                     <BotAvatar />
//                   </div>
//                   <div className="flex-1">
//                     <div className="inline-block p-4 bg-gray-100 rounded-2xl rounded-bl-md">
//                       <div className="flex gap-1">
//                         <div
//                           className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                           style={{ animationDelay: "0ms" }}
//                         ></div>
//                         <div
//                           className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                           style={{ animationDelay: "150ms" }}
//                         ></div>
//                         <div
//                           className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                           style={{ animationDelay: "300ms" }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>
//           )}
//         </div>

//         {/* Input Area - Sticky Bottom */}
//         <div className="border-t border-gray-200 bg-white p-4">
//           <div className="max-w-4xl mx-auto">
//             <Form {...form}>
//               <div className="relative">
//                 <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100 transition-all duration-200">
//                   <FormField
//                     name="prompt"
//                     render={({ field }) => (
//                       <FormItem className="flex-1">
//                         <FormControl className="m-0 p-0">
//                           <textarea
//                             {...field}
//                             ref={textareaRef}
//                             onKeyDown={handleKeyDown}
//                             onInput={handleTextareaInput}
//                             placeholder="Message Lumina AI..."
//                             className="flex-1 bg-transparent border-0 outline-none resize-none px-4 py-3 text-sm placeholder-gray-500 max-h-32 min-h-[44px] w-full rounded-2xl focus:ring-0 focus-visible:ring-0 focus-visible:border-transparent"
//                             rows={1}
//                             disabled={isLoading}
//                             style={{
//                               scrollbarWidth: "thin",
//                               scrollbarColor: "#CBD5E1 transparent",
//                             }}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                   <Button
//                     onClick={form.handleSubmit(onSubmit)}
//                     disabled={!form.watch("prompt")?.trim() || isLoading}
//                     className="m-2 p-2 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0 h-10 w-10"
//                     size="sm"
//                   >
//                     <Send className="w-4 h-4 text-white" />
//                   </Button>
//                 </div>
//               </div>
//             </Form>

//             {/* Footer text */}
//             <p className="text-xs text-gray-500 text-center mt-3">
//               Lumina AI can make mistakes. Please verify important information.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConversationPage;

"use client";

import axios from "axios";
import * as z from "zod";
import {
  MessageSquare,
  Send,
  Sparkles,
  Plus,
  History,
  Trash2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import { useUser } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  setCurrentSessionId,
  setSessions,
  addSession,
  updateSessionTitle,
} from "@/lib/redux/features/chatSessionSlice";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";

import { cn } from "@/lib/utils";
import { formSchema } from "./constants";
import { UserAvatar } from "@/components/ui/user-avatar";
import { BotAvatar } from "@/components/ui/bot-avatar";

interface ChatSession {
  _id: string;
  user_id: string;
  title: string;
  created_at: string;
}

interface ChatMessage {
  _id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface ConversationPageProps {
  // Remove props since we're using Redux entirely
}

const ConversationPage: React.FC<ConversationPageProps> = () => {
  // Redux dispatch and selectors
  const dispatch = useDispatch();
  const sessions = useSelector(
    (state: RootState) => state.chatSession.sessions
  );
  const currentSessionId = useSelector(
    (state: RootState) => state.chatSession.currentSessionId
  );

  console.log("Redux currentSessionId:", currentSessionId);

  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get user ID from Clerk auth
  const { user } = useUser();
  const userId = user?.id || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Load messages when currentSessionId changes (from Redux)
  useEffect(() => {
    if (currentSessionId) {
      console.log("Loading messages for session:", currentSessionId);
      loadChatMessages(currentSessionId);
    } else {
      console.log("Clearing messages - no session");
      setMessages([]);
    }
  }, [currentSessionId]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user sessions on component mount
  useEffect(() => {
    if (userId) {
      loadUserSessions();
    }
  }, [userId]);

  // Load user sessions from API
  const loadUserSessions = async () => {
    try {
      const response = await axios.get(`/api/chat-sessions?user_id=${userId}`);
      dispatch(setSessions(response.data || []));
    } catch (error) {
      console.error("Error loading user sessions:", error);
      dispatch(setSessions([]));
    }
  };

  // Load messages for a specific session
  const loadChatMessages = async (sessionId: string) => {
    if (!sessionId) {
      console.log("No session ID provided to loadChatMessages");
      return;
    }

    console.log("Loading messages for session:", sessionId);
    setIsLoadingMessages(true);

    try {
      const response = await axios.get(
        `/api/chat-messages?session_id=${sessionId}`
      );

      console.log("Loaded messages:", response.data);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Error loading chat messages:", error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Update session title in both API and Redux
  const updateSessionTitleHandler = async (
    sessionId: string,
    firstMessage: string
  ) => {
    try {
      // Generate a title from the first message (first 50 characters)
      const title =
        firstMessage.length > 50
          ? firstMessage.substring(0, 50) + "..."
          : firstMessage;

      // Update in API
      await axios.put(`/api/chat-sessions/${sessionId}`, { title });

      // Update in Redux
      dispatch(updateSessionTitle({ sessionId, title }));
    } catch (error) {
      console.error("Error updating session title:", error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let sessionId = currentSessionId;

      // Create new session if none exists
      if (!sessionId) {
        const sessionResponse = await axios.post("/api/chat-sessions", {
          user_id: userId,
          title: "New Chat",
        });

        const newSession = sessionResponse.data;
        sessionId = newSession._id;

        // Update Redux state
        dispatch(addSession(newSession));
        dispatch(setCurrentSessionId(sessionId));
      }

      // Save user message
      const userMessageResponse = await axios.post("/api/chat-messages", {
        session_id: sessionId,
        role: "user",
        content: values.prompt,
      });

      const userMessage = userMessageResponse.data;

      // Update local messages with user message immediately
      setMessages((prev) => [...prev, userMessage]);

      // Get AI response - use current messages state plus the new user message
      const currentMessages = [
        ...messages,
        { role: "user", content: values.prompt },
      ];
      const conversationResponse = await axios.post("/api/conversation", {
        messages: currentMessages,
      });

      // Save assistant message
      const assistantMessageResponse = await axios.post("/api/chat-messages", {
        session_id: sessionId,
        role: "assistant",
        content: conversationResponse.data.content,
      });

      const assistantMessage = assistantMessageResponse.data;

      // Update local messages with assistant message
      setMessages((prev) => [...prev, assistantMessage]);

      // Update session title if this is the first message in the session
      if (messages.length === 0 && sessionId) {
        await updateSessionTitleHandler(sessionId, values.prompt);
      }

      form.reset();

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error: any) {
      console.error("Error in onSubmit:", error);
      // Optional: Add user-facing error handling here
    } finally {
      router.refresh();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (form.watch("prompt")?.trim()) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = Math.min(target.scrollHeight, 128) + "px";
  };

  const suggestedPrompts = [
    "Help me write a professional email",
    "Explain a complex topic simply",
    "Create a marketing strategy",
    "Tell me a joke",
  ];

  const handleSuggestedPrompt = (prompt: string) => {
    form.setValue("prompt", prompt);
    textareaRef.current?.focus();
  };

  // Helper function to create new session
  const createNewSession = async () => {
    try {
      const sessionResponse = await axios.post("/api/chat-sessions", {
        user_id: userId,
        title: "New Chat",
      });

      const newSession = sessionResponse.data;

      // Update Redux state
      dispatch(addSession(newSession));
      dispatch(setCurrentSessionId(newSession._id));

      // Clear messages for new session
      setMessages([]);

      return newSession._id;
    } catch (error) {
      console.error("Error creating new session:", error);
      return null;
    }
  };

  return (
    <div className="flex h-[90vh] bg-white w-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <Loader />
            </div>
          ) : messages.length === 0 && !isLoading ? (
            /* Welcome Screen */
            <div className="flex flex-col items-center justify-center h-full px-4 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                Welcome to Lumina AI
              </h2>
              <p className="text-gray-600 text-center mb-8 max-w-md">
                I'm here to help you with questions, creative tasks, analysis,
                and more. What would you like to explore today?
              </p>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="p-3 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors duration-200 hover:border-gray-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="max-w-4xl mx-auto w-full px-4 py-6">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={cn(
                    "flex gap-4 mb-6",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                  </div>

                  {/* Message Content */}
                  <div
                    className={cn(
                      "flex-1 max-w-[85%]",
                      message.role === "user" ? "text-right" : "text-left"
                    )}
                  >
                    <div
                      className={cn(
                        "inline-block p-4 rounded-2xl prose prose-sm max-w-none",
                        message.role === "user"
                          ? "bg-blue-500 text-white rounded-br-md prose-invert"
                          : "bg-gray-100 text-gray-900 rounded-bl-md"
                      )}
                    >
                      <ReactMarkdown className="text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <BotAvatar />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-4 bg-gray-100 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - Sticky Bottom */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-4xl mx-auto">
            <Form {...form}>
              <div className="relative">
                <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100 transition-all duration-200">
                  <FormField
                    name="prompt"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl className="m-0 p-0">
                          <textarea
                            {...field}
                            ref={textareaRef}
                            onKeyDown={handleKeyDown}
                            onInput={handleTextareaInput}
                            placeholder="Message Lumina AI..."
                            className="flex-1 bg-transparent border-0 outline-none resize-none px-4 py-3 text-sm placeholder-gray-500 max-h-32 min-h-[44px] w-full rounded-2xl focus:ring-0 focus-visible:ring-0 focus-visible:border-transparent"
                            rows={1}
                            disabled={isLoading}
                            style={{
                              scrollbarWidth: "thin",
                              scrollbarColor: "#CBD5E1 transparent",
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={!form.watch("prompt")?.trim() || isLoading}
                    className="m-2 p-2 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0 h-10 w-10"
                    size="sm"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            </Form>

            {/* Footer text */}
            <p className="text-xs text-gray-500 text-center mt-3">
              Lumina AI can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
