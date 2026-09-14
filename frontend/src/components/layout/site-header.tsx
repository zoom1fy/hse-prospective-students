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
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="bg-brand-600 flex size-9 items-center justify-center rounded-xl text-sm font-bold text-white">
            {siteConfig.shortName}
          </span>
          <span className="text-heading text-base font-semibold tracking-tight">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/dashboard" className={buttonVariants({ variant: "secondary", size: "sm" })}>
              Личный кабинет
            </Link>
            <Link href="/dashboard/applications" className={buttonVariants({ size: "sm" })}>
              Мои заявки
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Меню"
            aria-expanded={open}
            className="border-border inline-flex size-10 items-center justify-center rounded-lg border md:hidden"
          >
            <span className="sr-only">Открыть меню</span>
            <span className="flex flex-col gap-1">
              <span className="bg-foreground block h-0.5 w-5" />
              <span className="bg-foreground block h-0.5 w-5" />
              <span className="bg-foreground block h-0.5 w-5" />
            </span>
          </button>
        </div>
      </Container>

      {open ? (
        <div className="border-border border-t md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {siteConfig.nav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium">
              Личный кабинет
            </Link>
            <Link
              href="/dashboard/applications"
              className="rounded-lg px-3 py-2 text-sm font-medium"
            >
              Мои заявки
            </Link>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
