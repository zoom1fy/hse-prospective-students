"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { Bot, ChevronDown, Send, Sparkles, Trash } from "@/components/ui/icons";
import { streamChat } from "@/lib/ai";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
}

const STORAGE_KEY = "hse-chat-history";

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "bot",
  text: "Здравствуйте! Я помощник абитуриента. Спросите меня о вузах, программах, экзаменах или сроках подачи документов.",
};

const suggestions = [
  "Какие сроки подачи документов?",
  "Что нужно для поступления?",
  "Сколько стоит обучение?",
  "Какие ЕГЭ нужны?",
];

function uid() {
  return `msg-${Math.random().toString(36).slice(2, 9)}`;
}

function loadHistory(): ChatMessage[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [welcomeMessage];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as ChatMessage[];
  } catch {
    // ignore corrupted storage
  }
  return [welcomeMessage];
}

function saveHistory(messages: ChatMessage[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-100)));
  } catch {
    // ignore storage errors (private mode, quota)
  }
}

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [streaming, setStreaming] = useState<ChatMessage | null>(null);
  const [value, setValue] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const started = messages.some((message) => message.role === "user");
  const responding = streaming !== null;

  useEffect(() => {
    setMessages(loadHistory());
  }, []);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || responding) return;

    console.log("[chat] sendMessage:", { text: trimmed });

    const botId = uid();
    setMessages((items) => [...items, { id: uid(), role: "user", text: trimmed }]);
    setStreaming({ id: botId, role: "bot", text: "" });
    setValue("");

    let reply = "";
    try {
      for await (const chunk of streamChat(trimmed)) {
        reply += chunk.text;
        setStreaming({ id: botId, role: "bot", text: reply });
        if (chunk.done) break;
      }
      console.log("[chat] reply done, length:", reply.length);
    } catch (error) {
      console.error("[chat] reply error:", error);
      reply = "Не удалось получить ответ. Попробуйте ещё раз или проверьте подключение к ИИ.";
      setStreaming({ id: botId, role: "bot", text: reply });
    } finally {
      setMessages((items) => [...items, { id: botId, role: "bot", text: reply }]);
      setStreaming(null);
    }
  }

  function clearHistory() {
    console.log("[chat] clear history");
    setMessages([welcomeMessage]);
    setStreaming(null);
  }

  return (
    <Card className="border-border/60 bg-surface/80 dark:border-border/60 dark:bg-surface/80 relative flex max-h-[min(72vh,660px)] min-h-[min(72vh)] flex-1 flex-col overflow-hidden rounded-3xl border shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] backdrop-blur-xl">
      {/* Декоративное свечение сверху */}
      <div className="from-brand-500/10 pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b to-transparent" />

      <CardHeader className="border-border/40 dark:border-border/60 relative z-10 flex-none flex-row items-center gap-3 border-b px-5 py-4">
        <div className="relative">
          <span className="from-brand-500 to-brand-700 shadow-brand-500/25 inline-flex size-10 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg">
            <Bot className="size-5" />
          </span>
          <span className="border-surface absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-emerald-500" />
        </div>
        <div className="flex flex-col">
          <p className="text-heading text-sm font-semibold tracking-tight">ИИ Чат-бот</p>
          <p className="text-muted text-xs">{responding ? "Формирует ответ…" : "Онлайн"}</p>
        </div>
        <div className="ml-auto">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={clearHistory}
            className="text-muted hover:text-foreground"
            aria-label="Очистить историю"
            title="Очистить историю"
          >
            <Trash className="size-4" />
            Очистить
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 flex min-h-0 flex-1 flex-col p-0">
        <div ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "animate-in fade-in slide-in-from-bottom-2 flex gap-3 duration-300",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {message.role === "bot" ? (
                <span className="from-brand-500 to-brand-700 shadow-brand-500/20 mt-0.5 inline-flex size-8 flex-none items-center justify-center rounded-xl bg-linear-to-br text-white shadow-md">
                  <Bot className="size-4" />
                </span>
              ) : null}
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap sm:max-w-[70%]",
                  message.role === "user"
                    ? "from-brand-600 to-brand-700 shadow-brand-500/20 rounded-br-md bg-linear-to-br text-white shadow-md"
                    : "border-border/60 bg-surface text-foreground dark:border-border dark:bg-surface-muted dark:text-foreground rounded-bl-md border shadow-sm",
                )}
              >
                {message.text}
              </div>
            </div>
          ))}

          {streaming ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 flex items-start gap-3 duration-300">
              <span className="from-brand-500 to-brand-700 shadow-brand-500/20 mt-0.5 inline-flex size-8 flex-none items-center justify-center rounded-xl bg-linear-to-br text-white shadow-md">
                <Bot className="size-4" />
              </span>
              <div
                className={cn(
                  "border-border/60 bg-surface text-foreground dark:border-border dark:bg-surface-muted dark:text-foreground max-w-[85%] rounded-2xl rounded-bl-md border px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm sm:max-w-[70%]",
                )}
              >
                {streaming.text ? (
                  <>
                    {streaming.text}
                    <span className="bg-brand-500 ml-0.5 inline-block h-3.5 w-0.5 animate-pulse align-middle" />
                  </>
                ) : (
                  <span className="flex gap-1 py-1">
                    <span className="bg-muted size-1.5 animate-bounce rounded-full [animation-delay:0ms]" />
                    <span className="bg-muted size-1.5 animate-bounce rounded-full [animation-delay:150ms]" />
                    <span className="bg-muted size-1.5 animate-bounce rounded-full [animation-delay:300ms]" />
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-border/40 dark:border-border/60 flex-none border-t p-4 sm:p-5">
          {!started ? (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setSuggestionsOpen((v) => !v)}
                aria-expanded={suggestionsOpen}
                aria-controls="chat-suggestions"
                className="group text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200 mb-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium transition-colors"
              >
                <Sparkles className="size-3.5" />
                {suggestionsOpen ? "Скрыть подсказки" : "Показать подсказки"}
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-300",
                    suggestionsOpen ? "rotate-0" : "-rotate-90",
                  )}
                />
              </button>

              <div
                id="chat-suggestions"
                className={cn(
                  "grid transition-all duration-300 ease-out",
                  suggestionsOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "pointer-events-none grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-wrap gap-2 pt-1">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => sendMessage(suggestion)}
                        disabled={responding}
                        className="hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:hover:border-brand-700 dark:hover:bg-brand-950/40 dark:hover:text-brand-300 border-border bg-surface text-foreground dark:border-border dark:bg-surface-muted dark:text-muted cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all disabled:opacity-40"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(value);
            }}
            className="group focus-within:border-brand-400 focus-within:ring-brand-500/10 dark:focus-within:border-brand-600 border-border bg-surface dark:border-border dark:bg-surface-muted flex items-center gap-2 rounded-2xl border p-1.5 shadow-sm transition-all focus-within:ring-4"
          >
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Напишите ваш вопрос…"
              aria-label="Ваш вопрос"
              className="h-11 border-0 bg-transparent px-3 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
            <Button
              type="submit"
              className="from-brand-600 to-brand-700 shadow-brand-500/20 hover:shadow-brand-500/30 flex size-10 flex-none items-center justify-center rounded-xl bg-linear-to-br text-white shadow-md transition-all hover:shadow-lg disabled:opacity-30 disabled:shadow-none"
              disabled={!value.trim() || responding}
              aria-label="Отправить"
            >
              <svg
                xmlns="http://w3.org"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
              >
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </Button>
          </form>
          <p className="text-muted mt-3 text-center text-[11px]">
            Ответы формируются нейросетью и могут содержать неточности.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
