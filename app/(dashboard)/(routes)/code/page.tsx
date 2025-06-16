// "use client";

// import axios from "axios";
// import * as z from "zod";
// import { Code } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import OpenAI from "openai";
// import ReactMarkdown from "react-markdown";

// import { Heading } from "@/components/heading";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Empty } from "@/components/empty";
// import { Loader } from "@/components/loader";

// import { cn } from "@/lib/utils";
// import { formSchema } from "./constants";
// import { UserAvatar } from "@/components/ui/user-avatar";
// import { BotAvatar } from "@/components/ui/bot-avatar";

// const CodePage = () => {
//   const router = useRouter();
//   const [messages, setMessages] = useState<
//     OpenAI.Chat.CreateChatCompletionRequestMessage[]
//   >([]);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       prompt: "",
//     },
//   });

//   const isLoading = form.formState.isSubmitting;

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       const userMessage = {
//         role: "user",
//         content: values.prompt,
//       };

//       const newMessages = [...messages, userMessage];

//       const response = await axios.post("/api/code", {
//         messages: newMessages,
//       });

//       setMessages((current) => [...current, userMessage, response.data]);

//       form.reset();
//     } catch (error: any) {
//       //todo: open pro model
//       console.log(error);
//     } finally {
//       router.refresh();
//     }
//   };

//   return (
//     <div>
//       <Heading
//         title="Code Generation"
//         description="Generate code from natural language with Lumina.AI"
//         icon={Code}
//         iconColor="text-green-700"
//         bgColor="bg-green-700/10"
//       />
//       <div className="px-4 lg:px-8">
//         <div>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
//             >
//               <FormField
//                 name="prompt"
//                 render={({ field }) => (
//                   <FormItem className="col-span-12 lg:col-span-10">
//                     <FormControl className="m-0 p-0">
//                       <Input
//                         className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
//                         disabled={isLoading}
//                         placeholder="Enter your prompt here."
//                         {...field}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               <Button
//                 className="col-span-12 lg:col-span-2 w-full"
//                 disabled={isLoading}
//               >
//                 Generate
//               </Button>
//             </form>
//           </Form>
//         </div>
//         <div className="space-y-4 mt-4">
//           {isLoading && (
//             <div className="p-8 rounded-lg w-full flex items-center justify-center vg-muted">
//               <Loader />
//             </div>
//           )}
//           {messages.length === 0 && !isLoading && (
//             <Empty label="No conversation started" />
//           )}
//           <div className="flex flex-col-reverse gap-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.content}
//                 className={cn(
//                   "p-8 w-full flex items-center gap-x-8 rounded-lg",
//                   message.role === "user"
//                     ? "bg-white border border-black/10"
//                     : "bg-muted"
//                 )}
//               >
//                 {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
//                 <ReactMarkdown
//                   components={{
//                     pre: ({ node, ...props }) => (
//                       <div className="overflow-auto bg-black/10 p-4 rounded-lg w-full my-2">
//                         <pre {...props} />
//                       </div>
//                     ),
//                     code: ({ node, ...props }) => (
//                       <code className="bg-black/10 rounded-lg p-1" {...props} />
//                     ),
//                   }}
//                   className="text-sm overflow-hidden leading-7"
//                 >
//                   {message.content || ""}
//                 </ReactMarkdown>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CodePage;
"use client";

import axios from "axios";
import * as z from "zod";
import { Code, Send, Terminal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";

import { cn } from "@/lib/utils";
import { formSchema } from "./constants";
import { UserAvatar } from "@/components/ui/user-avatar";
import { BotAvatar } from "@/components/ui/bot-avatar";

const CodePage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<
    OpenAI.Chat.CreateChatCompletionRequestMessage[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = {
        role: "user" as const,
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/code", {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error: any) {
      //todo: open pro model
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = Math.min(target.scrollHeight, 128) + "px";
  };

  const suggestedPrompts = [
    "Create a React component with TypeScript",
    "Write a Python function to sort an array",
    "Build a REST API endpoint with validation",
    "Generate SQL queries for user management",
  ];

  const handleSuggestedPrompt = (prompt: string) => {
    form.setValue("prompt", prompt);
    textareaRef.current?.focus();
  };

  // Helper to recursively extract all text from React children
  function extractTextFromChildren(children: any): string {
    if (typeof children === "string" || typeof children === "number") {
      return children.toString();
    }
    if (Array.isArray(children)) {
      return children.map(extractTextFromChildren).join("");
    }
    if (children && typeof children === "object" && "props" in children) {
      return extractTextFromChildren(children.props.children);
    }
    return "";
  }

  return (
    <div className="flex flex-col h-[90vh] bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !isLoading ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-center h-full px-4 max-w-2xl mx-auto">
            {/* <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6">
              <Code className="w-8 h-8 text-white" />
            </div> */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
              Code Generation Assistant
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-md">
              I can help you write, debug, and explain code in any programming
              language. Describe what you need and I'll generate it for you.
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
            {messages.map((message, index) => (
              <div
                key={index}
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
                    "flex-1 max-w-[90%]",
                    message.role === "user" ? "text-right" : "text-left"
                  )}
                >
                  <div
                    className={cn(
                      "inline-block p-4 rounded-2xl prose prose-sm max-w-none",
                      message.role === "user"
                        ? "bg-blue-500 text-white rounded-br-md prose-invert"
                        : "bg-gray-100 text-gray-900 rounded-bl-md prose-code:bg-gray-800 prose-code:text-gray-100"
                    )}
                  >
                    <ReactMarkdown
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        pre: ({ node, ...props }) => {
                          // Use the helper to extract code string from children
                          const codeText = extractTextFromChildren(
                            props.children
                          );
                          return (
                            <div className="relative overflow-hidden bg-gray-900 rounded-lg w-full my-3 border border-gray-700 shadow-lg">
                              {/* Code header */}
                              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                                <div className="flex items-center gap-2">
                                  <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  </div>
                                  <span className="text-gray-400 text-xs font-medium ml-2">
                                    Code
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    if (codeText) {
                                      navigator.clipboard.writeText(
                                        codeText.trim()
                                      );
                                    }
                                  }}
                                  className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded transition-colors"
                                >
                                  Copy
                                </button>
                              </div>
                              {/* Code content with syntax highlighting */}
                              <div className="overflow-auto">
                                <pre
                                  {...props}
                                  className="text-sm leading-relaxed m-0 p-4 bg-transparent"
                                  style={{ background: "transparent" }}
                                />
                              </div>
                            </div>
                          );
                        },
                        code: ({
                          node,
                          inline,
                          className,
                          children,
                          ...props
                        }) => {
                          // For inline code
                          if (inline) {
                            return (
                              <code
                                className="bg-gray-200 text-gray-800 rounded px-2 py-1 text-sm font-mono border"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          }

                          // For code blocks - let rehype-highlight handle the styling
                          return (
                            <code
                              className={`${
                                className || ""
                              } font-mono text-sm block`}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                        // Enhanced styling for other elements
                        h1: ({ node, ...props }) => (
                          <h1
                            className="text-xl font-bold text-gray-900 mb-3 mt-4 first:mt-0"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-lg font-semibold text-gray-900 mb-2 mt-3 first:mt-0"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-base font-semibold text-gray-900 mb-2 mt-3 first:mt-0"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p
                            className="text-gray-700 mb-3 leading-relaxed"
                            {...props}
                          />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            className="list-disc list-inside text-gray-700 mb-3 ml-4"
                            {...props}
                          />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="list-decimal list-inside text-gray-700 mb-3 ml-4"
                            {...props}
                          />
                        ),
                        li: ({ node, ordered, ...props }) => (
                          <li className="mb-1" {...props} />
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-3"
                            {...props}
                          />
                        ),
                      }}
                      className="text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    >
                      {message.content || ""}
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
              <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-green-300 focus-within:ring-2 focus-within:ring-green-100 transition-all duration-200">
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
                          placeholder="Describe the code you want to generate..."
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
                  className="m-2 p-2 rounded-xl bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0 h-10 w-10"
                  size="sm"
                >
                  <Send className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </Form>

          {/* Footer text */}
          <p className="text-xs text-gray-500 text-center mt-3">
            Lumina AI can generate code in multiple languages. Always review and
            test generated code.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
