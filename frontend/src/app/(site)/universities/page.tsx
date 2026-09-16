import type { Metadata } from "next";

import { ProgramCard } from "@/components/programs/program-card";
import { UniversityFilters } from "@/components/filters/university-filters";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { filterPrograms, getCatalog } from "@/lib/api";

export const metadata: Metadata = {
  title: "Вузы и программы",
  description:
    "Каталог университетов и образовательных программ с фильтрами по городу, уровню и форме обучения.",
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function UniversitiesPage({ searchParams }: PageProps<"/universities">) {
  const params = await searchParams;

  const query = first(params.q);
  const city = first(params.city) || "all";
  const degree = first(params.degree) || "all";
  const form = first(params.form) || "all";
  const budgetOnly = first(params.budgetOnly) === "true";

  const { programs: catalogPrograms, cities } = await getCatalog();
  const programs = filterPrograms(catalogPrograms, { query, city, degree, form, budgetOnly });

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Вузы и программы" }]} />

      <PageHeader
        className="mt-4"
        eyebrow="Каталог"
        title="Вузы и программы"
        description="Ищите по названию, фильтруйте по городу, уровню образования и форме обучения."
      />

      <div className="mt-8">
        <UniversityFilters cities={cities} values={{ q: query, city, degree, form, budgetOnly }} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-muted">
          Найдено программ: <span className="text-foreground font-medium">{programs.length}</span>
        </p>
      </div>

      {programs.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      ) : (
        <EmptyState
          className="mt-4"
          title="Ничего не найдено"
          description="Попробуйте изменить фильтры или сбросить их."
          action={<ButtonLink href="/universities">Сбросить фильтры</ButtonLink>}
        />
      )}
    </Container>
  );
}
