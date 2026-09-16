import type { Metadata } from "next";
import Link from "next/link";

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
import { materials } from "@/data/materials";
import { getFaculties, getProgramsByFaculty, universities } from "@/data/universities";

export const metadata: Metadata = {
  title: "Админ-панель",
};

const sections = [
  {
    href: "/admin/users",
    title: "Пользователи",
    description: "Список абитуриентов, их профили, документы и статусы заявок.",
    icon: Users,
  },
  {
    href: "/admin/universities",
    title: "Университеты",
    description: "Управление вузами, факультетами и их описаниями.",
    icon: Building2,
  },
  {
    href: "/admin/programs",
    title: "Программы",
    description: "Направления подготовки, места, стоимость и вступительные испытания.",
    icon: ClipboardList,
  },
  {
    href: "/admin/materials",
    title: "Материалы",
    description: "Статьи, гайды и справочные материалы для абитуриентов.",
    icon: BookOpen,
  },
];

export default function AdminPage() {
  const programCount = universities.reduce(
    (sum, university) =>
      sum +
      getFaculties(university).reduce(
        (part, faculty) => part + getProgramsByFaculty(faculty.id).length,
        0,
      ),
    0,
  );

  return (
    <div>
      <PageHeader
        eyebrow="Админ-панель"
        title="Раздел в разработке"
        description="Здесь будут инструменты для управления пользователями, вузами, программами и материалами."
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Users className="text-brand-600 size-5" />
            <div>
              <p className="text-sm text-muted">Пользователи</p>
              <p className="text-xl font-semibold">—</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Building2 className="text-brand-600 size-5" />
            <div>
              <p className="text-sm text-muted">Университеты</p>
              <p className="text-xl font-semibold">{universities.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <ClipboardList className="text-brand-600 size-5" />
            <div>
              <p className="text-sm text-muted">Программы</p>
              <p className="text-xl font-semibold">{programCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Award className="text-brand-600 size-5" />
            <div>
              <p className="text-sm text-muted">Материалы</p>
              <p className="text-xl font-semibold">{materials.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold tracking-tight">Только заглушка</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                Страницы администратора ещё не готовы: API, ограничение доступа по ролям и
                интерфейс управления появятся позже. Сейчас здесь можно посмотреть структуру
                будущих разделов.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline"
            >
              Вернуться в личный кабинет
            </Link>
          </div>
        </CardContent>
      </Card>

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
                  Раздел в разработке
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