import type { Metadata } from "next";

import { ApplicationTree } from "@/components/applications/application-tree";
import { StatusBadge } from "@/components/applications/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { applicationTree, countApplications } from "@/data/applications";

export const metadata: Metadata = {
  title: "Дерево заявок",
};

export default function ApplicationsPage() {
  const totalPrograms = countApplications();
  const totalFaculties = applicationTree.reduce(
    (sum, university) => sum + university.faculties.length,
    0,
  );

  return (
    <div>
      <PageHeader
        eyebrow="Личный кабинет"
        title="Дерево поданных заявок"
        description="Вузы, факультеты и программы — в виде дерева. Нажмите на любой элемент, чтобы перейти к информации."
        actions={
          <ButtonLink href="/universities" variant="secondary">
            Найти ещё программу
          </ButtonLink>
        }
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <Badge variant="neutral">
          Вузов: <span className="ml-1 font-semibold">{applicationTree.length}</span>
        </Badge>
        <Badge variant="neutral">
          Факультетов: <span className="ml-1 font-semibold">{totalFaculties}</span>
        </Badge>
        <Badge variant="neutral">
          Программ: <span className="ml-1 font-semibold">{totalPrograms}</span>
        </Badge>
      </div>

      <Card className="mt-6">
        <CardContent className="flex flex-wrap items-center gap-3 p-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="text-foreground font-medium">Легенда:</span>
          <StatusBadge status="draft" />
          <StatusBadge status="submitted" />
          <StatusBadge status="under-review" />
          <StatusBadge status="invited" />
          <StatusBadge status="enrolled" />
          <StatusBadge status="rejected" />
        </CardContent>
      </Card>

      <div className="mt-6">
        {applicationTree.length > 0 ? (
          <ApplicationTree data={applicationTree} />
        ) : (
          <EmptyState
            title="Пока нет поданных заявок"
            description="Начните с подбора программ и подайте первую заявку."
            action={<ButtonLink href="/dashboard/recommendations">Подобрать программы</ButtonLink>}
          />
        )}
      </div>
    </div>
  );
}
