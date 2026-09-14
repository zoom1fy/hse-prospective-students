"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-3 text-lg font-medium transition-colors",
        isActive
          ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-200"
          : "hover:text-foreground text-zinc-600 dark:text-zinc-400",
      )}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <Container className="flex h-32 items-center justify-between gap-6">
        <Link href="/" aria-label={siteConfig.name}>
          <span className="text-heading text-3xl font-bold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "secondary", size: "xl" })}
            >
              Личный кабинет
            </Link>
            <Link href="/dashboard/applications" className={buttonVariants({ size: "xl" })}>
              Мои заявки
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Меню"
            aria-expanded={open}
            className="border-border inline-flex size-14 items-center justify-center rounded-xl border transition-colors hover:bg-black/5 md:hidden dark:hover:bg-white/10"
          >
            <span className="sr-only">Открыть меню</span>
            <span className="flex flex-col gap-1.5">
              <span className="bg-foreground block h-0.5 w-6" />
              <span className="bg-foreground block h-0.5 w-6" />
              <span className="bg-foreground block h-0.5 w-6" />
            </span>
          </button>
        </div>
      </Container>

      {open ? (
        <div className="border-border border-t md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {siteConfig.nav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
            <Link href="/dashboard" className="rounded-lg px-4 py-3 text-lg font-medium">
              Личный кабинет
            </Link>
            <Link
              href="/dashboard/applications"
              className="rounded-lg px-4 py-3 text-lg font-medium"
            >
              Мои заявки
            </Link>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
