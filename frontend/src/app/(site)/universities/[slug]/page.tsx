import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProgramCard } from "@/components/programs/program-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getUniversityBySlug, getUniversityGroups } from "@/lib/api";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/universities/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const university = await getUniversityBySlug(slug);
  if (!university) return { title: "Вуз не найден" };
  return {
    title: university.shortName,
    description: university.about,
  };
}

export default async function UniversityPage({ params }: PageProps<"/universities/[slug]">) {
  const { slug } = await params;
  const university = await getUniversityBySlug(slug);

  if (!university) {
    notFound();
  }

  const universityGroups = await getUniversityGroups(university);
  const programsCount = universityGroups.reduce((sum, group) => sum + group.programs.length, 0);

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Вузы и программы", href: "/universities" },
          { label: university.shortName },
        ]}
      />

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {university.ranking > 0 ? (
          <Card>
            <CardContent className="p-5">
              <p className="text-muted text-sm">Место в рейтинге</p>
              <p className="mt-1 text-2xl font-semibold">#{university.ranking}</p>
            </CardContent>
          </Card>
        ) : null}
        {university.students > 0 ? (
          <Card>
            <CardContent className="p-5">
              <p className="text-muted text-sm">Студентов</p>
              <p className="mt-1 text-2xl font-semibold">{formatNumber(university.students)}</p>
            </CardContent>
          </Card>
        ) : null}
        <Card>
          <CardContent className="p-5">
            <p className="text-muted text-sm">Программ</p>
            <p className="mt-1 text-2xl font-semibold">{programsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-muted text-sm">Оценка абитуриентов</p>
            <p className="mt-1 text-2xl font-semibold">{university.rating.toFixed(1)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">О вузе</h2>
        <p className="text-foreground mt-3 max-w-3xl text-sm leading-6">{university.about}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {university.tags.map((tag) => (
            <Badge key={tag} variant="neutral">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Факультеты и программы</h2>
        <div className="mt-6 flex flex-col gap-10">
          {universityGroups.map(({ faculty, programs }) => {
            return (
              <section key={faculty.id} id={`faculty-${faculty.slug}`} className="scroll-mt-24">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-semibold tracking-tight">{faculty.name}</h3>
                  <span className="text-muted text-sm">{programs.length} программ(ы)</span>
                </div>
                <p className="text-muted mt-1 max-w-3xl text-sm">{faculty.about}</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {programs.map((program) => (
                    <ProgramCard key={program.id} program={program} showUniversity={false} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
