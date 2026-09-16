import type { Metadata } from "next";

import { ChatWindow } from "@/components/chat/chat-window";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "ИИ Чат-бот",
  description: "Задайте вопрос о вузах, программам и приёмной кампании — бот поможет разобраться.",
};

export default function ChatPage() {
  return (
    <section className="from-brand-50/50 via-brand-50/20 to-background dark:from-brand-950/40 dark:via-brand-950/10 flex flex-1 flex-col bg-linear-to-b">
      <Container className="flex flex-1 flex-col py-8 sm:py-12">
        <ChatWindow />
      </Container>
    </section>
  );
}
