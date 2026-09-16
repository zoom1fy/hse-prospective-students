"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ApplicationTree } from "@/components/applications/application-tree";
import { StatusBadge } from "@/components/applications/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCatalog, getStatementTree } from "@/lib/api";
import { isApiConfigured } from "@/lib/api/client";
import { toApplicationStatusByName } from "@/lib/api/references";
import type { ApplicationUniversityNode } from "@/types";

async function loadTree(): Promise<ApplicationUniversityNode[]> {
  const [tree, catalog] = await Promise.all([getStatementTree(), getCatalog()]);
  const universitiesById = new Map(
    catalog.programs.map((program) => [program.university.id, program.university]),
  );

  return tree.map((university) => {
    const details = universitiesById.get(String(university.id));
    return {
      id: String(university.id),
      universitySlug: String(university.id),
      universityName: university.name,
      universityShortName: details?.shortName ?? university.name,
      city: details?.city ?? "",
      faculties: university.faculties.map((faculty) => ({
        id: String(faculty.id),
        facultySlug: String(faculty.id),
        facultyName: faculty.name,
        programs: faculty.programs.map((program, index) => ({
          id: String(program.id),
          programSlug: String(program.id),
          programName: program.name ?? "",
          status: toApplicationStatusByName(program.status),
          priority: index + 1,
          submittedAt: "",
        })),
      })),
    };
  });
}

function countPrograms(tree: ApplicationUniversityNode[]): number {
  return tree.reduce(
    (sum, university) =>
      sum +
      university.faculties.reduce((facultySum, faculty) => facultySum + faculty.programs.length, 0),
    0,
  );
}

export function ApplicationsContent() {
  const [tree, setTree] = useState<ApplicationUniversityNode[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isApiConfigured()) {
        setState("error");
        return;
      }
      try {
        const nodes = await loadTree();
        if (cancelled) return;
        setTree(nodes);
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

  const totalPrograms = countPrograms(tree);
  const totalFaculties = tree.reduce((sum, university) => sum + university.faculties.length, 0);

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
          Вузов: <span className="ml-1 font-semibold">{tree.length}</span>
        </Badge>
        <Badge variant="neutral">
          Факультетов: <span className="ml-1 font-semibold">{totalFaculties}</span>
        </Badge>
        <Badge variant="neutral">
          Программ: <span className="ml-1 font-semibold">{totalPrograms}</span>
        </Badge>
      </div>

      <Card className="mt-6">
        <CardContent className="text-muted flex flex-wrap items-center gap-3 p-4 text-sm">
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
        {state === "loading" ? (
          <div className="border-border bg-surface text-muted rounded-xl border p-6 text-sm">
            Загрузка…
          </div>
        ) : null}

        {state === "error" ? (
          <div className="border-border text-muted rounded-xl border border-dashed p-12 text-center text-sm">
            <p>Не удалось загрузить заявки.</p>
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

        {state === "ready" ? (
          tree.length > 0 ? (
            <ApplicationTree data={tree} />
          ) : (
            <EmptyState
              title="Пока нет поданных заявок"
              description="Начните с подбора программ и подайте первую заявку."
              action={
                <ButtonLink href="/dashboard/recommendations">Подобрать программы</ButtonLink>
              }
            />
          )
        ) : null}
      </div>
    </div>
  );
}
