"use client";

import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { getUserProfile } from "@/lib/api";
import { isApiConfigured } from "@/lib/api/client";

type GuardState = "loading" | "ok" | "auth" | "forbidden" | "error";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GuardState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!isApiConfigured()) {
        setState("error");
        return;
      }
      try {
        const profile = await getUserProfile();
        if (cancelled) return;
        if (!profile) setState("auth");
        else if (!profile.isAdmin) setState("forbidden");
        else setState("ok");
      } catch {
        if (!cancelled) setState("error");
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="border-border bg-surface text-muted rounded-xl border p-6 text-sm">
        Проверка доступа…
      </div>
    );
  }

  if (state === "ok") {
    return <>{children}</>;
  }

  const content =
    state === "auth"
      ? {
          title: "Требуется вход",
          description:
            "Админ-панель доступна только администраторам. Войдите в аккаунт с правами администратора.",
          action: <ButtonLink href="/login">Войти</ButtonLink>,
        }
      : state === "forbidden"
        ? {
            title: "Недостаточно прав",
            description: "У вашего аккаунта нет прав администратора.",
            action: (
              <ButtonLink href="/dashboard" variant="secondary">
                В личный кабинет
              </ButtonLink>
            ),
          }
        : {
            title: "Не удалось проверить доступ",
            description: "API не настроен или недоступен. Попробуйте позже.",
            action: (
              <ButtonLink href="/" variant="secondary">
                На главную
              </ButtonLink>
            ),
          };

  return (
    <div>
      <PageHeader eyebrow="Админ-панель" title={content.title} description={content.description} />
      <div className="mt-6">{content.action}</div>
    </div>
  );
}
