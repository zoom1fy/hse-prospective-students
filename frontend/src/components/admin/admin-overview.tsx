"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  ClipboardList,
  Users,
} from "@/components/ui/icons";
import {
  getAdminPrograms,
  getAdminStatements,
  getAdminUsers,
  getAllMaterials,
  getUniversities,
} from "@/lib/api/admin";

interface Stats {
  users: number;
  universities: number;
  programs: number;
  statements: number;
  materials: number;
}

const sections = [
  {
    href: "/admin/users",
    title: "Пользователи",
    description: "Профили абитуриентов, права доступа и удаление.",
    icon: Users,
    key: "users" as const,
  },
  {
    href: "/admin/universities",
    title: "Университеты и факультеты",
    description: "Вузы, факультеты, сайты и регионы.",
    icon: Building2,
    key: "universities" as const,
  },
  {
    href: "/admin/programs",
    title: "Программы",
    description: "Направления, места, стоимость и активность.",
    icon: ClipboardList,
    key: "programs" as const,
  },
  {
    href: "/admin/statements",
    title: "Заявки",
    description: "Все заявления абитуриентов и их статусы.",
    icon: Award,
    key: "statements" as const,
  },
  {
    href: "/admin/materials",
    title: "Материалы",
    description: "Статьи и гайды для абитуриентов.",
    icon: BookOpen,
    key: "materials" as const,
  },
];

export function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [users, universities, programs, statements, materials] = await Promise.all([
          getAdminUsers(),
          getUniversities(),
          getAdminPrograms(),
          getAdminStatements(),
          getAllMaterials(),
        ]);
        if (cancelled) return;
        setStats({
          users: users.length,
          universities: universities.length,
          programs: programs.length,
          statements: statements.length,
          materials: materials.length,
        });
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Админ-панель"
        title="Обзор"
        description="Управление пользователями, вузами, программами, заявками и материалами."
      />

      {state === "loading" ? (
        <div className="border-border bg-surface text-muted mt-8 rounded-xl border p-6 text-sm">
          Загрузка…
        </div>
      ) : null}

      {state === "error" ? (
        <div className="border-border text-muted mt-8 rounded-xl border border-dashed p-12 text-center text-sm">
          Не удалось загрузить статистику. Проверьте, что вы вошли как администратор.
        </div>
      ) : null}

      {state === "ready" && stats ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.href}>
                <CardContent className="flex items-center gap-3 p-5">
                  <Icon className="text-brand-600 size-5 shrink-0" />
                  <div>
                    <p className="text-muted text-sm">{section.title.split(" ")[0]}</p>
                    <p className="text-xl font-semibold">{stats[section.key]}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href} className="group block">
              <Card className="hover:border-brand-300 dark:hover:border-brand-700 flex h-full flex-col p-6 transition-all duration-200 group-hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="bg-surface-muted text-foreground flex size-9 items-center justify-center rounded-xl">
                    <Icon className="size-4" />
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight">{section.title}</h3>
                </div>
                <p className="text-muted mt-3 flex-1 text-sm leading-relaxed">
                  {section.description}
                </p>
                <span className="text-brand-600 dark:text-brand-400 mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                  Перейти
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
