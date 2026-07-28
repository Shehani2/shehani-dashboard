"use client";

import { useState } from "react";
import { Sparkles, X, Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface AssistantDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function AssistantDrawer({ open, onClose }: AssistantDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi Shehani! 🌸 I'm Rose, your personal AI growth assistant. How can I help you plan your day or career goals today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");

    const updatedMessages: Message[] = [...messages, { role: "user", text: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      setMessages([...updatedMessages, { role: "assistant", text: data.text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          text: "Oops! AI backend route eken connection error ekak aawa. Terminal eke dev server eka restart karala balamuda?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-100 text-sm">Ask Rose</h3>
              <p className="text-[11px] text-zinc-400">Personal AI Companion</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white text-xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-rose-600 text-white rounded-br-none"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
              {m.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 text-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-rose-400 animate-pulse">
              <Sparkles className="h-4 w-4" /> Rose is typing...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="pt-2 border-t border-zinc-800 flex gap-2">
          <input
            type="text"
            placeholder="Ask Rose anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 text-xs text-zinc-200 focus:border-rose-500 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="rounded-xl bg-rose-600 px-4 py-3 text-white hover:bg-rose-500 transition disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}