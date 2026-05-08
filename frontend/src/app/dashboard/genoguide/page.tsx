"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, Loader2, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";

/** Failsafe: if tags leaked into the streamed response buffer, split client-side. */
function splitMessageTags(thought: string, response: string): { thought: string; response: string } {
  const raw = `${thought || ""}\n${response || ""}`;
  const th = raw.match(/\[THOUGHT\]([\s\S]*?)\[\/THOUGHT\]/i);
  const rs = raw.match(/\[RESPONSE\]([\s\S]*?)\[\/RESPONSE\]/i);
  if (!th && !rs) return { thought: thought || "", response: response || "" };
  return {
    thought: th ? th[1].trim() : thought || "",
    response: rs ? rs[1].trim() : (response || "").replace(/\[THOUGHT\][\s\S]*?\[\/THOUGHT\]/gi, "").trim(),
  };
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content?: string;
  thought?: string;
  response?: string;
  timestamp: Date;
}

const suggestions = [
  "What is Beta Thalassemia?",
  "How does carrier screening work?",
  "Explain the Punnett Square",
  "What is G6PD Deficiency?",
  "How is the immunity score calculated?",
  "Tell me about Sickle Cell in Nepal",
  "How is blood group inherited?",
  "What is Y-chromosome infertility?",
];

export default function GenoGuidePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      response:
        "Welcome to **GenoGuide**.\n\nThis is a clinical explainer to help you understand genetic diseases, inheritance patterns, and carrier risks.\n\nChoose a suggested topic below or type your question.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", thought: "", response: "", timestamp: new Date() }]);

    try {
      const streamResponse = await api.genoguide.chatStream(text, "general", attachment);
      const reader = streamResponse.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let firstTokenReceived = false;

      if (!reader) throw new Error("No stream reader available");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.thought_delta || parsed.response_delta) {
              if (!firstTokenReceived) {
                firstTokenReceived = true;
                setLoading(false);
              }
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        thought: (m.thought || "") + (parsed.thought_delta || ""),
                        response: (m.response || "") + (parsed.response_delta || ""),
                      }
                    : m
                )
              );
            }
          } catch {
            // Ignore malformed chunk and continue stream consumption.
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== assistantId || m.role !== "assistant") return m;
          const split = splitMessageTags(m.thought || "", m.response || "");
          return { ...m, thought: split.thought, response: split.response };
        })
      );
    } catch (error) {
      setLoading(false);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                response: "I could not reach the local GenoGuide model. Please ensure Ollama is running with medgemma1.5:4b.",
              }
            : m
        )
      );
    } finally {
      setAttachment(null);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="shrink-0 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="h-6 w-6 text-olive" /> GenoGuide
            </h1>
            <p className="text-sm text-slate/80 mt-0.5">Genetic counseling, explained clearly.</p>
          </div>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 rounded-3xl flex flex-col overflow-hidden bg-cream border border-beige shadow-[0_18px_40px_rgba(45,58,35,0.08)]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto max-h-[calc(100vh-250px)] p-4 sm:p-6">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-white border border-beige flex items-center justify-center shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-olive" />
                    </div>
                  )}
                  {msg.role === "user" ? (
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed chat-bubble-user">
                      <div
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: (msg.content || "")
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\n/g, "<br/>")
                            .replace(
                              /```([\s\S]*?)```/g,
                              '<pre class="bg-cream rounded-2xl border border-beige p-3 mt-2 mb-2 text-xs font-mono overflow-x-auto">$1</pre>'
                            ),
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 my-2 max-w-[85%] min-w-0 flex-1">
                      {loading && msg.id === messages[messages.length - 1]?.id && !msg.thought && !msg.response && !msg.content ? (
                        <div className="chat-bubble-ai rounded-2xl px-3 py-2 flex items-center gap-2 text-sm text-slate/80 w-max">
                          <Loader2 className="h-4 w-4 animate-spin" /> Formulating guidance…
                        </div>
                      ) : null}
                      
                      {msg.content && !msg.thought && !msg.response ? (
                         <div className="bg-white border border-blue-100 shadow-sm rounded-lg p-3">
                           <div
                             className="text-base text-slate-800 leading-relaxed whitespace-pre-wrap"
                             dangerouslySetInnerHTML={{
                               __html: (msg.content || "")
                                 .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                 .replace(/\n/g, "<br/>")
                                 .replace(
                                   /```([\s\S]*?)```/g,
                                   '<pre class="bg-slate-50 rounded-lg border border-slate-200 p-3 mt-2 mb-2 text-xs font-mono overflow-x-auto">$1</pre>'
                                 ),
                             }}
                           />
                         </div>
                      ) : null}

                      {msg.thought ? (
                        <div className="bg-slate-100 border border-slate-200 rounded-lg p-3">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">🧠 Internal Reasoning</h4>
                          <p className="text-sm text-slate-600 font-mono italic whitespace-pre-wrap">{msg.thought}</p>
                        </div>
                      ) : null}
                      {msg.response ? (
                        <div className="bg-white border border-blue-100 shadow-sm rounded-lg p-3">
                          <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">💡 Clinical Counsel</h4>
                          <div
                            className="text-base text-slate-800 leading-relaxed whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{
                              __html: (msg.response || "")
                                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                .replace(/\n/g, "<br/>")
                                .replace(
                                  /```([\s\S]*?)```/g,
                                  '<pre class="bg-slate-50 rounded-lg border border-slate-200 p-3 mt-2 mb-2 text-xs font-mono overflow-x-auto">$1</pre>'
                                ),
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  )}
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-softgreen/25 border border-softgreen/40 flex items-center justify-center shrink-0 mt-1">
                      <User className="h-4 w-4 text-slate" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((s, i) => (
              <button key={i} onClick={() => void sendMessage(s)}
                className="px-3 py-1.5 rounded-full text-xs border border-beige text-olive hover:bg-beige/25 transition-all">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-beige bg-white">
          {attachment && (
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-beige bg-cream px-3 py-1 text-xs text-olive">
              <span>📎 {attachment.name}</span>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="rounded-full p-0.5 hover:bg-beige/40"
                aria-label="Remove attachment"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.type !== "application/pdf") return;
                setAttachment(file);
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-[44px] w-[44px] shrink-0 rounded-2xl border-beige bg-cream p-0"
              title="Attach PDF"
              aria-label="Attach PDF"
            >
              <Paperclip className="h-4 w-4 text-olive" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage(input); } }}
              placeholder="Ask about genetics..."
              className="min-h-[44px] max-h-[120px] resize-none bg-cream border-beige focus:border-olive text-slate rounded-2xl"
              rows={1}
            />
            <Button onClick={() => void sendMessage(input)} disabled={!input.trim() || loading}
              className="h-[44px] w-[44px] shrink-0 rounded-2xl bg-olive hover:bg-softgreen hover:text-slate text-cream p-0 transition-colors"
              aria-label="Send message"
              title="Send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
