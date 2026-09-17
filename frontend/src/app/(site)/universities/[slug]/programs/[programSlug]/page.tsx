import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ApplyButton } from "@/components/programs/apply-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Award, CalendarClock, Check, GraduationCap, Wallet } from "@/components/ui/icons";
import { getProgramPage } from "@/lib/api";
import { degreeLabels, studyFormLabels } from "@/lib/site";
import { formatCurrency, formatDate, formatNumber, getDaysLeft } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/universities/[slug]/programs/[programSlug]">): Promise<Metadata> {
  const { slug, programSlug } = await params;
  const program = await getProgramPage(slug, programSlug);
  if (!program) return { title: "Программа не найдена" };
  return {
    title: program.name,
    description: program.about,
  };
}

export default async function ProgramPage({
  params,
}: PageProps<"/universities/[slug]/programs/[programSlug]">) {
  const { slug, programSlug } = await params;
  const programWithContext = await getProgramPage(slug, programSlug);

  if (!programWithContext) {
    notFound();
  }

  const program = programWithContext;
  const university = programWithContext.university;
  const faculty = programWithContext.faculty;
  const daysLeft = getDaysLeft(program.deadline);

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Вузы и программы", href: "/universities" },
          { label: university.shortName, href: `/universities/${university.slug}` },
          { label: program.name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{degreeLabels[program.degree] ?? program.degree}</Badge>
            <Badge variant="neutral">{studyFormLabels[program.form] ?? program.form}</Badge>
            {daysLeft > 0 ? <Badge variant="success">Набор открыт</Badge> : null}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{program.name}</h1>
          <p className="text-muted mt-2 text-sm">
            {university.shortName} · {faculty.name} · {university.city}
          </p>

          <section className="mt-8">
            <h2 className="text-lg font-semibold tracking-tight">О программе</h2>
            <p className="text-foreground mt-3 text-sm leading-6">{program.about}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold tracking-tight">Вступительные испытания</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {program.exams.map((exam) => (
                <li
                  key={exam}
                  className="border-border bg-surface flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                >
                  <Check className="text-brand-600 size-4" />
                  {exam}
                </li>
              ))}
            </ul>
            <p className="text-muted mt-3 text-xs">
              Языки обучения: {program.languages.join(", ")}
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <GraduationCap className="text-brand-600 size-5" />
                <div>
                  <p className="text-muted text-sm">Бюджетные места</p>
                  <p className="font-semibold">{formatNumber(program.budgetPlaces)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="text-brand-600 size-5" />
                <div>
                  <p className="text-muted text-sm">Проходной балл (сумма ЕГЭ)</p>
                  <p className="font-semibold">
                    {program.minScore > 0 ? program.minScore : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wallet className="text-brand-600 size-5" />
                <div>
                  <p className="text-muted text-sm">Платное обучение</p>
                  <p className="font-semibold">
                    {formatNumber(program.paidPlaces)} мест ·{" "}
                    {formatCurrency(program.tuitionPerYear)}/год
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarClock className="text-brand-600 size-5" />
                <div>
                  <p className="text-muted text-sm">Приём документов до</p>
                  <p className="font-semibold">{formatDate(program.deadline)}</p>
                </div>
              </div>

              <div className="border-border text-muted border-t pt-4 text-sm">
                Срок обучения: {program.durationYears} лет
              </div>

              <ApplyButton programId={program.id} />

              <Link
                href={`/universities/${university.slug}`}
                className="text-brand-600 dark:text-brand-400 text-center text-sm font-medium hover:underline"
              >
                Все программы {university.shortName}
              </Link>
            </CardContent>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
