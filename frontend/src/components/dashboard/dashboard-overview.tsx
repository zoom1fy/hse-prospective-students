"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookOpen, ClipboardList, FileText, Sparkles } from "@/components/ui/icons";
import { Progress } from "@/components/ui/progress";
import { applicationTree, countApplications } from "@/data/applications";
import { currentUserProfile } from "@/data/profile";
import { getRecommendations } from "@/data/recommendations";
import {
  generateCurrentUserRecommendations,
  getCurrentUserRecommendations,
  getStatementTree,
  getStatementsCount,
  getUserProfile,
} from "@/lib/api";
import { isApiConfigured } from "@/lib/api/client";
import type { ApiStatementTreeUniversity } from "@/lib/api/types";
import { applicationStatusLabels } from "@/lib/site";
import type { ProgramRecommendation, UserProfile } from "@/types";

interface OverviewProgram {
  id: string;
  name: string;
  status: string;
}

interface OverviewUniversity {
  id: string;
  name: string;
  programs: OverviewProgram[];
}

interface OverviewData {
  profile: UserProfile;
  statementsCount: number;
  recommendations: ProgramRecommendation[];
  applications: OverviewUniversity[];
}

function getCompleteness(profile: UserProfile) {
  const checks = [
    Boolean(profile.fullName.last && profile.fullName.first),
    Boolean(profile.email),
    profile.diplomas.length > 0,
    profile.achievements.length > 0,
    Boolean(profile.education),
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

function mapMockApplications(): OverviewUniversity[] {
  return applicationTree.map((university) => ({
    id: university.id,
    name: university.universityShortName,
    programs: university.faculties.flatMap((faculty) =>
      faculty.programs.map((program) => ({
        id: program.id,
        name: program.programName,
        status: applicationStatusLabels[program.status] ?? program.status,
      })),
    ),
  }));
}

function mapApiApplications(tree: ApiStatementTreeUniversity[]): OverviewUniversity[] {
  return tree.map((university) => ({
    id: String(university.id),
    name: university.name,
    programs: university.faculties.flatMap((faculty) =>
      faculty.programs.map((program) => ({
        id: String(program.id),
        name: program.name ?? "",
        status: program.status,
      })),
    ),
  }));
}

export function DashboardOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isApiConfigured()) {
        setData({
          profile: currentUserProfile,
          statementsCount: countApplications(),
          recommendations: getRecommendations(currentUserProfile, 3),
          applications: mapMockApplications(),
        });
        setState("ready");
        return;
      }

      try {
        const [profile, statementsCount, storedRecommendations, tree] = await Promise.all([
          getUserProfile(),
          getStatementsCount(),
          getCurrentUserRecommendations(),
          getStatementTree(),
        ]);
        if (cancelled) return;

        if (!profile) {
          setState("error");
          return;
        }

        const recommendations =
          storedRecommendations.length > 0
            ? storedRecommendations
            : await generateCurrentUserRecommendations(3);
        if (cancelled) return;

        setData({
          profile,
          statementsCount,
          recommendations,
          applications: mapApiApplications(tree),
        });
        setState("ready");
      } catch {
        if (cancelled) return;
        setState("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="border-border bg-surface text-muted rounded-xl border p-6 text-sm">
        Загрузка…
      </div>
    );
  }

  if (state === "error" || !data) {
    return (
      <div className="border-border text-muted rounded-xl border border-dashed p-12 text-center text-sm">
        <p>Не удалось загрузить данные.</p>
        <p className="mt-2">
          <Link
            href="/login"
            className="text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            Войдите в аккаунт
          </Link>{" "}
          или попробуйте позже.
        </p>
      </div>
    );
  }

  const { profile, statementsCount, recommendations, applications } = data;
  const completeness = getCompleteness(profile);

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
              <p className="text-muted text-sm">Заявок подано</p>
              <p className="text-xl font-semibold">{statementsCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <FileText className="text-brand-600 size-5" />
            <div>
              <p className="text-muted text-sm">Дипломов</p>
              <p className="text-xl font-semibold">
                {profile.diplomas.length > 0 ? profile.diplomas.length : "в разработке"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Award className="text-brand-600 size-5" />
            <div>
              <p className="text-muted text-sm">Достижений</p>
              <p className="text-xl font-semibold">
                {profile.achievements.length > 0 ? profile.achievements.length : "в разработке"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Sparkles className="text-brand-600 size-5" />
            <div>
              <p className="text-muted text-sm">Рекомендаций</p>
              <p className="text-xl font-semibold">
                {recommendations.length > 0 ? recommendations.length : "в разработке"}
              </p>
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
              <span className="text-muted">Чем больше данных, тем точнее подбор программ</span>
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
              <span className="text-muted">ФИО</span>
              <span className="text-right">
                {profile.fullName.last} {profile.fullName.first}
                {profile.fullName.middle ? ` ${profile.fullName.middle}` : ""}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted">Регион</span>
              <span>{profile.region ?? "Не указан"}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted">Email</span>
              <span className="break-all">{profile.email}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted">Аттестат</span>
              {profile.diplomas[0] ? (
                <Badge variant="neutral">
                  {profile.diplomas[0].year} · ср. {profile.diplomas[0].averageScore}
                </Badge>
              ) : (
                <span>в разработке</span>
              )}
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
        {recommendations.length > 0 ? (
          <div className="mt-4 flex flex-col gap-3">
            {recommendations.map(({ program, score }) => (
              <Card key={program.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-medium">{program.name}</p>
                    <p className="text-muted text-sm">
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
        ) : (
          <div className="border-border text-muted mt-4 rounded-xl border border-dashed p-8 text-center text-sm">
            Рекомендации в разработке — сгенерируйте их, заполнив профиль.
          </div>
        )}
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
        {applications.length > 0 ? (
          <div className="mt-4 flex flex-col gap-2">
            {applications.slice(0, 2).map((university) => (
              <Card key={university.id}>
                <CardContent className="flex flex-col gap-3 p-4">
                  <span className="inline-flex items-center gap-2 font-medium">
                    <BookOpen className="text-brand-600 size-4" />
                    {university.name}
                  </span>
                  <ul className="flex flex-col gap-1">
                    {university.programs.map((program) => (
                      <li
                        key={program.id}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span>{program.name}</span>
                        <span className="text-muted text-xs whitespace-nowrap">
                          {program.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border-border text-muted mt-4 rounded-xl border border-dashed p-8 text-center text-sm">
            Заявок пока нет.
          </div>
        )}
      </div>
    </div>
  );
}
