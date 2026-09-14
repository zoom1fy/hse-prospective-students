import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, ClipboardList, FileText, Sparkles } from "@/components/ui/icons";
import { countApplications, applicationTree } from "@/data/applications";
import { currentUserProfile } from "@/data/profile";
import { getRecommendations } from "@/data/recommendations";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Личный кабинет",
};

function getCompleteness() {
  const profile = currentUserProfile;
  const checks = [
    Boolean(profile.fullName.last && profile.fullName.first),
    Boolean(profile.passport.number),
    Boolean(profile.snils),
    profile.diplomas.length > 0,
    profile.achievements.length > 0,
    profile.education.length > 0,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

export default function DashboardPage() {
  const profile = currentUserProfile;
  const completeness = getCompleteness();
  const recommendations = getRecommendations(profile, 3);
  const applications = countApplications();

  return (
    <div>
      <PageHeader
        eyebrow="Личный кабинет"
        title={`Здравствуйте, ${profile.fullName.first}!`}
        description="Управляйте личными данными, документами и заявками в одном месте."
        actions={
          <ButtonLink href="/dashboard/profile" variant="secondary">
            Редактировать профиль
          </ButtonLink>
        }
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <ClipboardList className="text-brand-600 size-5" />
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Заявок подано</p>
              <p className="text-xl font-semibold">{applications}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <FileText className="text-brand-600 size-5" />
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Дипломов</p>
              <p className="text-xl font-semibold">{profile.diplomas.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Award className="text-brand-600 size-5" />
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Достижений</p>
              <p className="text-xl font-semibold">{profile.achievements.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Sparkles className="text-brand-600 size-5" />
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Рекомендаций</p>
              <p className="text-xl font-semibold">{recommendations.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader>
            <CardTitle>Полнота профиля</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                Чем больше данных, тем точнее подбор программ
              </span>
              <span className="font-semibold">{completeness}%</span>
            </div>
            <Progress className="mt-3" value={completeness} />
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/dashboard/profile"
                className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline"
              >
                Заполнить документы
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ваши данные</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500 dark:text-zinc-400">ФИО</span>
              <span className="text-right">
                {profile.fullName.last} {profile.fullName.first} {profile.fullName.middle}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500 dark:text-zinc-400">СНИЛС</span>
              <span>{profile.snils}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500 dark:text-zinc-400">Email</span>
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500 dark:text-zinc-400">Аттестат</span>
              <Badge variant="neutral">
                {profile.diplomas[0]?.year} · ср. {profile.diplomas[0]?.averageScore}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Рекомендованные программы</h2>
          <Link
            href="/dashboard/recommendations"
            className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline"
          >
            Все рекомендации
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {recommendations.map(({ program, score }) => (
            <Card key={program.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium">{program.name}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {program.university.shortName} · {program.faculty.shortName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">{score}% соответствие</Badge>
                  <Link
                    href={`/universities/${program.university.slug}/programs/${program.slug}`}
                    className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline"
                  >
                    Открыть
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Последние заявки</h2>
          <Link
            href="/dashboard/applications"
            className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline"
          >
            Дерево заявок
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {applicationTree.slice(0, 2).map((university) => (
            <Card key={university.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <span className="inline-flex items-center gap-2 font-medium">
                  <BookOpen className="text-brand-600 size-4" />
                  {university.universityShortName}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {university.faculties
                    .flatMap((faculty) => faculty.programs)
                    .map((program) => program.programName)
                    .join(", ")}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  обновлено{" "}
                  {formatDate(
                    university.faculties[0]?.programs[0]?.submittedAt ?? new Date().toISOString(),
                  )}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
