"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, RefreshCw, Sparkles } from "@/components/ui/icons";
import { generateCurrentUserRecommendations, getCurrentUserRecommendations } from "@/lib/api";
import { isApiConfigured } from "@/lib/api/client";
import { degreeLabels, studyFormLabels } from "@/lib/site";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { ProgramRecommendation } from "@/types";

export function RecommendationsContent() {
  const [recommendations, setRecommendations] = useState<ProgramRecommendation[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">(() =>
    isApiConfigured() ? "loading" : "error",
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isApiConfigured()) return;
    let cancelled = false;

    (async () => {
      try {
        let items = await getCurrentUserRecommendations();
        if (items.length === 0) items = await generateCurrentUserRecommendations(6);
        if (cancelled) return;
        setRecommendations(items);
        setState(items.length > 0 ? "ready" : "error");
      } catch {
        if (!cancelled) setState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRefresh() {
    if (!isApiConfigured()) return;
    setRefreshing(true);
    try {
      const items = await generateCurrentUserRecommendations(6);
      setRecommendations(items);
      setState(items.length > 0 ? "ready" : "error");
    } catch {
      setState("error");
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Личный кабинет"
        title="Программы, которые вам подходят"
        description="Подбор формируется по данным вашего профиля и обновляется автоматически."
        actions={
          <Button variant="secondary" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className="size-4" />
            {refreshing ? "Подбираем…" : "Обновить подбор"}
          </Button>
        }
      />

      <div className="border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-900 dark:bg-brand-950/60 dark:text-brand-100 mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm">
        <Sparkles className="mt-0.5 size-4 shrink-0" />
        <p>
          Рекомендации рассчитываются на основе программ из базы. Заполните дипломы, достижения и
          профиль, чтобы повысить точность подбора.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        {state === "loading" ? (
          <div className="border-border bg-surface text-muted rounded-xl border p-6 text-sm">
            Загрузка…
          </div>
        ) : null}

        {state === "error" ? (
          <div className="border-border text-muted rounded-xl border border-dashed p-12 text-center text-sm">
            <p>Не удалось получить рекомендации.</p>
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
        ) : null}

        {state === "ready"
          ? recommendations.map(({ program, score, reasons }) => (
              <Card key={program.id}>
                <CardHeader className="flex-row items-start justify-between gap-4">
                  <div className="min-w-0">
                    <CardTitle>{program.name}</CardTitle>
                    <p className="text-muted mt-1 text-sm">
                      {program.university.shortName} · {program.faculty.shortName} ·{" "}
                      {program.university.city}
                    </p>
                  </div>
                  <Badge variant="success">{score}%</Badge>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{degreeLabels[program.degree] ?? program.degree}</Badge>
                    <Badge variant="neutral">{studyFormLabels[program.form] ?? program.form}</Badge>
                    <Badge variant="neutral">
                      {formatNumber(program.budgetPlaces)} бюджетных мест
                    </Badge>
                    <Badge variant="neutral">{formatCurrency(program.tuitionPerYear)}/год</Badge>
                  </div>

                  {reasons.length > 0 ? (
                    <ul className="flex flex-col gap-1.5">
                      {reasons.map((reason) => (
                        <li
                          key={reason}
                          className="text-foreground flex items-center gap-2 text-sm"
                        >
                          <Check className="size-4 text-emerald-600" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    <ButtonLink
                      href={`/universities/${program.university.slug}/programs/${program.slug}`}
                      size="sm"
                    >
                      Страница программы
                    </ButtonLink>
                    <ButtonLink
                      href={`/universities/${program.university.slug}`}
                      variant="secondary"
                      size="sm"
                    >
                      Страница вуза
                    </ButtonLink>
                  </div>
                </CardContent>
              </Card>
            ))
          : null}
      </div>
    </div>
  );
}
