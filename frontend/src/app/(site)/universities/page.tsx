import type { Metadata } from "next";

import { ProgramCard } from "@/components/programs/program-card";
import { UniversityFilters } from "@/components/filters/university-filters";
import { UniversityCard } from "@/components/universities/university-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { filterPrograms, getCatalog, getUniversities } from "@/lib/api";
import { toProgramFilters, type CatalogFilterValues } from "@/lib/filters";

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

  const values: CatalogFilterValues = {
    q: first(params.q),
    city: first(params.city) || "all",
    degree: first(params.degree) || "all",
    form: first(params.form) || "all",
    direction: first(params.direction) || "all",
    minScore: first(params.minScore),
    budgetOnly: first(params.budgetOnly) === "true",
  };

  const { programs: catalogPrograms, cities } = await getCatalog();
  const programs = filterPrograms(catalogPrograms, toProgramFilters(values));
  const universities = await getUniversities();
  const directions = [...new Set(catalogPrograms.map((program) => program.name))].sort((a, b) =>
    a.localeCompare(b, "ru"),
  );

  const programCountByUniversity = new Map<string, number>();
  for (const program of catalogPrograms) {
    programCountByUniversity.set(
      program.university.id,
      (programCountByUniversity.get(program.university.id) ?? 0) + 1,
    );
  }

  const hasFilters =
    Boolean(values.q.trim()) ||
    values.city !== "all" ||
    values.degree !== "all" ||
    values.form !== "all" ||
    values.direction !== "all" ||
    Boolean(values.minScore) ||
    values.budgetOnly;
  const visibleUniversityIds = new Set(programs.map((program) => program.university.id));
  const visibleUniversities = hasFilters
    ? universities.filter((university) => visibleUniversityIds.has(university.id))
    : universities;

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
        <UniversityFilters cities={cities} directions={directions} values={values} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-muted text-sm">
          Найдено программ: <span className="text-foreground font-medium">{programs.length}</span>
        </p>
      </div>

      {visibleUniversities.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-xl font-semibold tracking-tight">Вузы</h2>
          <p className="text-muted mt-1 text-sm">
            Перейдите на страницу вуза, чтобы посмотреть его факультеты и программы.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleUniversities.map((university) => (
              <UniversityCard
                key={university.id}
                university={university}
                programCount={programCountByUniversity.get(university.id) ?? 0}
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Программы</h2>
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
