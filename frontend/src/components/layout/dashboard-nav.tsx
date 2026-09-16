"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getUserProfile } from "@/lib/api";
import { isApiConfigured } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Обзор", exact: true },
  { href: "/dashboard/profile", label: "Личные данные" },
  { href: "/dashboard/recommendations", label: "Подбор программ" },
  { href: "/dashboard/applications", label: "Дерево заявок" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isApiConfigured()) return;
    let cancelled = false;

    (async () => {
      try {
        const profile = await getUserProfile();
        if (!cancelled) setIsAdmin(Boolean(profile?.isAdmin));
      } catch {
        if (!cancelled) setIsAdmin(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const navItems = isAdmin ? [...items, { href: "/admin", label: "Админ-панель" }] : items;

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
      {navItems.map((item) => {
        const isActive =
          "exact" in item && item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              isActive ? "bg-brand-600 text-white" : "text-muted hover:bg-muted/25",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
