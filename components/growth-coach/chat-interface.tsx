"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, User, RefreshCw, Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";

type ChatMessage = {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
};

const SUGGESTED_PROMPTS = [
  "What are my top 3 customer pain points?",
  "How can I improve my average rating?",
  "What do customers love most about my business?",
  "Which issues should I fix first this week?",
  "Give me a weekly action plan based on my reviews",
];

function getInitialMessages(bizName: string): ChatMessage[] {
  return [
    {
      id: "welcome",
      sender: "coach",
      text: `👋 Hello! I'm your AI Growth Coach for **${bizName}**.\n\nI have access to all your customer reviews and feedback data. Ask me anything about your customer sentiment, operational improvements, or growth strategy — and I'll give you real, data-driven answers.\n\nWhat would you like to know today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ];
}

export function ChatInterface() {
  const [bizName, setBizName] = useState("Your Business");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load live business name
    let name = "Your Business";
    try {
      const raw = localStorage.getItem("feedbackos_business");
      if (raw) {
        const p = JSON.parse(raw);
        if (p.name) name = p.name;
      }
    } catch {}

    fetch("/api/business/onboarding")
      .then((r) => r.json())
      .then((data) => {
        if (data?.business?.name) {
          name = data.business.name;
          setBizName(name);
          setMessages(getInitialMessages(name));
        } else {
          setBizName(name);
          setMessages(getInitialMessages(name));
        }
      })
      .catch(() => {
        setBizName(name);
        setMessages(getInitialMessages(name));
      });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Call live AI Growth Coach API with real business context
    fetch("/api/coach/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query, businessName: bizName }),
    })
      .then((res) => res.json())
      .then((data) => {
        const coachMsg: ChatMessage = {
          id: `cch-${Date.now()}`,
          sender: "coach",
          text: data.reply || "I've analyzed your feedback data. Let me know if you need more details.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, coachMsg]);
        setIsTyping(false);
      })
      .catch(() => {
        const fallbackMsg: ChatMessage = {
          id: `cch-${Date.now()}`,
          sender: "coach",
          text: `I'm having trouble connecting right now. Based on your ${bizName} feedback data, I recommend focusing on your most-mentioned customer pain points first. Try uploading more reviews for richer insights.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        setIsTyping(false);
      });
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/5 pb-3 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-foreground text-background">
            <Bot className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">AI Growth Coach</h1>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Live • Analyzing {bizName}
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground">
              Ask anything about your customer sentiment, churn risks, or operational strategy.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setMessages(getInitialMessages(bizName))}
          className="gap-2 text-[12px]"
        >
          <RefreshCw className="size-3.5" />
          Reset Chat
        </Button>
      </div>

      {/* Suggested Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-medium text-muted-foreground flex items-center gap-1">
          <Lightbulb className="size-3.5" /> Suggested questions:
        </span>
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="rounded-full border border-black/5 bg-background px-3 py-1.5 text-[12px] text-foreground transition-all hover:bg-muted dark:border-white/10"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto rounded-3xl border border-black/5 bg-background p-6 space-y-4 shadow-inner dark:border-white/10">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-2xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
          >
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full text-[12px] font-medium ${
                msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
              }`}
            >
              {msg.sender === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
            </span>

            <div
              className={`rounded-2xl p-4 text-[14px] leading-relaxed shadow-xs ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground border border-black/5 dark:border-white/10"
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              <p
                className={`mt-2 text-[10px] ${
                  msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-foreground text-background">
              <Bot className="size-4" />
            </span>
            <div className="rounded-2xl bg-muted p-4 text-[13px] text-muted-foreground flex items-center gap-2">
              <Sparkles className="size-4 animate-spin text-primary" />
              <span>Analyzing {bizName} customer data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3 rounded-2xl border border-black/5 bg-background p-2 shadow-sm dark:border-white/10"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask your AI Growth Coach about ${bizName} reviews...`}
          className="h-12 flex-1 bg-transparent px-4 text-[14px] outline-none placeholder:text-muted-foreground"
        />
        <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="size-10 rounded-xl">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
