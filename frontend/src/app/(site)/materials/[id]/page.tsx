import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarClock,
  FileText,
  GraduationCap,
  Wallet,
} from "@/components/ui/icons";
import { getMaterialBySlug, getMaterialsCatalog } from "@/lib/api/materials";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  FileText,
  Award,
  Wallet,
  GraduationCap,
};

export async function generateMetadata({
  params,
}: PageProps<"/materials/[id]">): Promise<Metadata> {
  const { id } = await params;
  const material = await getMaterialBySlug(id);
  if (!material) return { title: "Материал не найден" };
  return {
    title: material.title,
    description: material.description,
  };
}

export default async function MaterialPage({ params }: PageProps<"/materials/[id]">) {
  const { id } = await params;
  const material = await getMaterialBySlug(id);

  if (!material) {
    notFound();
  }

  const otherMaterials = (await getMaterialsCatalog()).filter((item) => item.id !== material.id);
  const Icon = iconMap[material.icon] ?? FileText;

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Полезные материалы", href: "/materials" },
          { label: material.title },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
        <article className="min-w-0">
          <div className="flex items-start gap-5">
            <span className="from-brand-600 to-brand-700 shadow-brand-500/20 flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg">
              <Icon className="size-8" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {material.title}
              </h1>
              <p className="text-muted mt-3 text-sm leading-6 sm:text-base">
                {material.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="neutral">
                  <CalendarClock className="mr-1 size-3.5" />
                  Обновлено: {material.updatedAt}
                </Badge>
                <Badge variant="neutral">{material.readTime} чтения</Badge>
              </div>
            </div>
          </div>

          <div className="mt-10 max-w-3xl">
            {material.sections.map((section) => (
              <section key={section.heading} className="mt-10 first:mt-0">
                <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-foreground mt-3 text-[15px] leading-7 sm:text-base sm:leading-8"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="border-border bg-surface mt-12 rounded-2xl border p-6 sm:p-8">
            <p className="text-lg font-semibold tracking-tight">
              Проверьте свои шансы на поступление
            </p>
            <p className="text-muted mt-2 max-w-2xl text-sm leading-relaxed">
              Заполните профиль — подбор программ учтёт ваши баллы, дипломы и достижения и
              рассчитает реалистичные шансы по каждому направлению.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <ButtonLink href="/dashboard/recommendations">
                Подобрать программу
                <ArrowRight className="size-4" />
              </ButtonLink>
              <Link
                href="/materials"
                className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline"
              >
                Все материалы
              </Link>
            </div>
          </div>
        </article>

        <aside className="lg:sticky lg:top-24">
          <Card>
            <CardHeader>
              <CardTitle>Другие материалы</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {otherMaterials.map((item) => {
                const ItemIcon = iconMap[item.icon] ?? FileText;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="hover:bg-muted/25 group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
                  >
                    <ItemIcon className="text-brand-600 size-5 shrink-0" />
                    <span className="flex-1 text-sm font-medium">{item.title}</span>
                    <ArrowRight className="text-muted size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
