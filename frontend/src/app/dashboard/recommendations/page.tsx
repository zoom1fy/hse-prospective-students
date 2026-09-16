import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "@/components/ui/icons";
import { currentUserProfile } from "@/data/profile";
import { getRecommendations } from "@/data/recommendations";
import { degreeLabels, studyFormLabels } from "@/lib/site";
import { formatCurrency, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Подбор программ",
};

export default function RecommendationsPage() {
  const recommendations = getRecommendations(currentUserProfile, 6);

  return (
    <div>
      <PageHeader
        eyebrow="Личный кабинет"
        title="Программы, которые вам подходят"
        description="Подбор учитывает ваши документы об образовании, олимпиады и достижения — не нужно просматривать весь каталог вручную."
      />

      <div className="border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-900 dark:bg-brand-950/60 dark:text-brand-100 mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm">
        <Sparkles className="mt-0.5 size-4 shrink-0" />
        <p>
          Рекомендации рассчитываются на основе вашего профиля. Заполните СНИЛС, дипломы и
          достижения, чтобы повысить точность.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        {recommendations.map(({ program, score, reasons }) => (
          <Card key={program.id}>
            <CardHeader className="flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{program.name}</CardTitle>
                <p className="mt-1 text-sm text-muted">
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
                <Badge variant="neutral">{formatNumber(program.budgetPlaces)} бюджетных мест</Badge>
                <Badge variant="neutral">{formatCurrency(program.tuitionPerYear)}/год</Badge>
              </div>

              {reasons.length > 0 ? (
                <ul className="flex flex-col gap-1.5">
                  {reasons.map((reason) => (
                    <li
                      key={reason}
                      className="flex items-center gap-2 text-sm text-foreground"
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
                  Сайт программы
                </ButtonLink>
                <ButtonLink
                  href={`/universities/${program.university.slug}`}
                  variant="secondary"
                  size="sm"
                >
                  Сайт вуза
                </ButtonLink>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
