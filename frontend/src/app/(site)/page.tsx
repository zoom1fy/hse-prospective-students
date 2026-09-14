import Link from "next/link";

import { HeroSearch } from "@/components/home/hero-search";
import { ProgramCard } from "@/components/programs/program-card";
import { UniversityCard } from "@/components/universities/university-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ArrowRight, CalendarClock, GraduationCap, Sparkles, Star } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getAllProgramsWithContext,
  getOpenAdmissions,
  getPopularPrograms,
  getTopUniversities,
  universities,
} from "@/data/universities";
import { formatDate, formatNumber } from "@/lib/utils";

export default function HomePage() {
  const topUniversities = getTopUniversities(6);
  const popularPrograms = getPopularPrograms(6);
  const openAdmissions = getOpenAdmissions(4);
  const totalPrograms = getAllProgramsWithContext().length;

  return (
    <>
      <section className="border-border from-brand-50 to-background dark:from-brand-950/40 dark:to-background border-b bg-gradient-to-b">
        <Container className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mx-auto">
              <Sparkles className="mr-1.5 size-3.5" />
              Приёмная кампания 2027 уже открыта
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Найдите вуз и программу, которая подходит именно вам
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-300">
              Ведущие университеты, популярные направления, открытые наборы и личный кабинет с
              подбором программ по вашим данным — в одном месте.
            </p>
            <div className="mx-auto mt-8 max-w-2xl">
              <HeroSearch />
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-zinc-600 dark:text-zinc-300">
              <span className="inline-flex items-center gap-2">
                <GraduationCap className="text-brand-600 size-4" />
                {universities.length} вузов
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="text-brand-600 size-4" />
                {formatNumber(totalPrograms)} программ
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarClock className="text-brand-600 size-4" />
                наборы до августа 2027
              </span>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <SectionHeading
          title="Ведущие университеты"
          description="Топ вузов по рейтингу и отзывам абитуриентов."
          action={
            <Link
              href="/universities"
              className="text-brand-600 dark:text-brand-400 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            >
              Все вузы
              <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topUniversities.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>
      </Container>

      <section className="border-border bg-surface border-y">
        <Container className="py-14 sm:py-16">
          <SectionHeading
            title="Популярные направления"
            description="Программы, которые чаще всего выбирают абитуриенты."
            action={
              <Link
                href="/universities"
                className="text-brand-600 dark:text-brand-400 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              >
                Смотреть все
                <ArrowRight className="size-4" />
              </Link>
            }
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <SectionHeading
          title="Открытые наборы"
          description="Успейте подать документы: ближайшие дедлайны приёмной кампании."
        />
        <div className="mt-8 flex flex-col gap-3">
          {openAdmissions.map((program) => (
            <Card key={program.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium">{program.name}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {program.university.shortName} · {program.faculty.shortName} ·{" "}
                    {program.university.city}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="success">до {formatDate(program.deadline)}</Badge>
                  <Link
                    href={`/universities/${program.university.slug}/programs/${program.slug}`}
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                  >
                    Подробнее
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      <Container className="pb-16">
        <div className="border-border bg-brand-600 flex flex-col items-start justify-between gap-6 rounded-2xl border p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight">Не знаете, с чего начать?</h2>
            <p className="text-brand-50 mt-2 text-sm">
              Заполните профиль в личном кабинете — мы подберём программы по вашим баллам,
              достижениям и документам об образовании.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Личный кабинет
            </Link>
            <Link
              href="/dashboard/recommendations"
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className: "text-white hover:bg-white/15",
              })}
            >
              Подобрать программы
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
