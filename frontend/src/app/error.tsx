"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Что-то пошло не так</h1>
      <p className="mt-3 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
        Попробуйте обновить страницу. Если ошибка повторяется — загляните позже.
      </p>
      <Button className="mt-6" onClick={reset}>
        Обновить
      </Button>
    </Container>
  );
}
