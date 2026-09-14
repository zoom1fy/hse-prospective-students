"use client";

import { useSyncExternalStore } from "react";

import { Moon, Sun } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("hse-theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Включить светлую тему" : "Включить тёмную тему"}
      className={cn(
        "text-foreground inline-flex size-14 items-center justify-center rounded-xl",
        "transition-colors hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10",
        "focus-visible:ring-brand-500 focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
      )}
    >
      {dark ? <Sun className="size-7" /> : <Moon className="size-7" />}
    </button>
  );
}
