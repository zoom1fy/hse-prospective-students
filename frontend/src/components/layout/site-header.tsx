"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Sparkles } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

function isNavItemActive(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function useAuth() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const update = () => setAuthed(Boolean(localStorage.getItem("hse-session")));
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  return authed;
}

function NavTabs() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const update = () => {
      const nav = navRef.current;
      if (!nav) {
        setIndicator(null);
        return;
      }
      const active = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a")).find((link) =>
        isNavItemActive(link.getAttribute("href") ?? "", pathname),
      );
      if (!active) {
        setIndicator(null);
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const linkRect = active.getBoundingClientRect();
      setIndicator({ left: linkRect.left - navRect.left, width: linkRect.width });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      className="relative hidden items-center gap-1 lg:flex"
      aria-label="Основная навигация"
    >
      {indicator ? (
        <span
          aria-hidden
          className="bg-brand-50 dark:bg-brand-950 absolute inset-y-1.5 rounded-lg transition-[left,width] duration-300 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      ) : null}
      {siteConfig.nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isNavItemActive(item.href, pathname) ? "page" : undefined}
          className={cn(
            "relative z-10 inline-flex h-18 w-48 cursor-pointer items-center justify-center rounded-lg text-center text-lg font-medium whitespace-nowrap transition-colors",
            isNavItemActive(item.href, pathname)
              ? "text-brand-700 dark:text-brand-200"
              : "hover:text-foreground text-zinc-600 dark:text-zinc-400",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

const chatBotClasses = cn(
  "from-brand-900 via-brand-800 to-brand-700 bg-gradient-to-r",
  "relative overflow-hidden rounded-lg shadow-lg shadow-brand-900/20 transition-shadow duration-500 hover:shadow-brand-600/50",
  "before:from-brand-800 before:via-brand-600 before:to-exact-600 before:absolute before:inset-0 before:z-0 before:bg-gradient-to-r",
  "before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
);

function ChatBotButton() {
  return (
    <Link href="/chat" className={buttonVariants({ size: "xl", className: chatBotClasses })}>
      <span className="relative z-10 inline-flex items-center gap-2">
        <Sparkles className="size-5" />
        ИИ Чат-бот
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const authed = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-32 w-full max-w-352 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label={siteConfig.name} className="cursor-pointer">
          <span className="text-heading text-3xl font-bold tracking-tight">{siteConfig.name}</span>
        </Link>

        <NavTabs />

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <ChatBotButton />
            <Link
              href={authed ? "/dashboard" : "/auth/login"}
              className={buttonVariants({ variant: "secondary", size: "xl" })}
            >
              {authed ? "Личный кабинет" : "Войти"}
            </Link>
          </div>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Меню"
            aria-expanded={open}
            className="border-border inline-flex size-14 cursor-pointer items-center justify-center rounded-xl border transition-colors hover:bg-black/5 md:hidden dark:hover:bg-white/10"
          >
            <span className="sr-only">Открыть меню</span>
            <span className="flex flex-col gap-1.5">
              <span className="bg-foreground block h-0.5 w-6" />
              <span className="bg-foreground block h-0.5 w-6" />
              <span className="bg-foreground block h-0.5 w-6" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-border border-t md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isNavItemActive(item.href, pathname) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-4 py-3 text-lg font-medium",
                  isNavItemActive(item.href, pathname)
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-200"
                    : "text-zinc-600 dark:text-zinc-400",
                )}
              >
                {item.label}
              </Link>
            ))}
            <ChatBotButton />
            <Link
              href={authed ? "/dashboard" : "/auth/login"}
              className="rounded-lg px-4 py-3 text-lg font-medium"
            >
              {authed ? "Личный кабинет" : "Войти"}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
