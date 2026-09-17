"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, ButtonLink, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { ArrowRight, Check, RefreshCw, Send } from "@/components/ui/icons";
import { applyToProgram } from "@/lib/api";
import { ApiError, isApiConfigured, isAuthenticated } from "@/lib/api/client";
import { cn } from "@/lib/utils";

type ApplyState = "idle" | "loading" | "applied" | "error";

interface ApplyButtonProps {
  programId: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  label?: string;
}

export function ApplyButton({
  programId,
  variant = "primary",
  size = "md",
  className,
  label = "Подать документы",
}: ApplyButtonProps) {
  const router = useRouter();
  const [state, setState] = useState<ApplyState>("idle");
  const [error, setError] = useState("");

  async function handleApply() {
    if (!isApiConfigured()) {
      setError("Подача заявок недоступна: API не настроен.");
      setState("error");
      return;
    }

    if (!isAuthenticated()) {
      router.push(`/login?next=/dashboard/applications`);
      return;
    }

    setState("loading");
    setError("");
    try {
      await applyToProgram(programId);
      setState("applied");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setState("applied");
        return;
      }
      if (err instanceof ApiError && err.status === 401) {
        router.push(`/login?next=/dashboard/applications`);
        return;
      }
      setError("Не удалось подать заявку. Попробуйте позже.");
      setState("error");
    }
  }

  if (state === "applied") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <ButtonLink href="/dashboard/applications" variant="secondary" size={size}>
          <Check className="size-4" />
          Заявка подана
        </ButtonLink>
        <span className="text-muted text-center text-xs">Смотреть дерево заявок</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button
        variant={variant}
        size={size}
        onClick={handleApply}
        disabled={state === "loading"}
        className="w-full"
      >
        {state === "loading" ? (
          <>
            <RefreshCw className="size-4 animate-spin" />
            Отправка…
          </>
        ) : (
          <>
            <Send className="size-4" />
            {label}
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
      {error ? <span className="text-xs text-rose-600 dark:text-rose-400">{error}</span> : null}
    </div>
  );
}
