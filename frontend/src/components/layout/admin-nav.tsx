"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Обзор", exact: true },
  { href: "/admin/users", label: "Пользователи" },
  { href: "/admin/universities", label: "Университеты" },
  { href: "/admin/programs", label: "Программы" },
  { href: "/admin/statements", label: "Заявки" },
  { href: "/admin/materials", label: "Материалы" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-brand-600 text-white"
                : "text-muted hover:bg-muted/25",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}