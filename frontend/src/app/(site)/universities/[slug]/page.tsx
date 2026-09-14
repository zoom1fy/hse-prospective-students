import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProgramCard } from "@/components/programs/program-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getFaculties, getProgramsByFaculty, getUniversity } from "@/data/universities";
import { formatNumber } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/universities/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const university = getUniversity(slug);
  if (!university) return { title: "Вуз не найден" };
  return {
    title: university.shortName,
    description: university.about,
  };
}

export default async function UniversityPage({ params }: PageProps<"/universities/[slug]">) {
  const { slug } = await params;
  const university = getUniversity(slug);

  if (!university) {
    notFound();
  }

  const universityFaculties = getFaculties(university);
  const programsCount = universityFaculties.reduce(
    (sum, faculty) => sum + getProgramsByFaculty(faculty.id).length,
    0,
  );

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
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Место в рейтинге</p>
            <p className="mt-1 text-2xl font-semibold">#{university.ranking}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Студентов</p>
            <p className="mt-1 text-2xl font-semibold">{formatNumber(university.students)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Программ</p>
            <p className="mt-1 text-2xl font-semibold">{programsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Оценка абитуриентов</p>
            <p className="mt-1 text-2xl font-semibold">{university.rating.toFixed(1)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">О вузе</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {university.about}
        </p>
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
          {universityFaculties.map((faculty) => {
            const facultyPrograms = getProgramsByFaculty(faculty.id);
            return (
              <section key={faculty.id} id={`faculty-${faculty.slug}`} className="scroll-mt-24">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-semibold tracking-tight">{faculty.name}</h3>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {facultyPrograms.length} программ(ы)
                  </span>
                </div>
                <p className="mt-1 max-w-3xl text-sm text-zinc-500 dark:text-zinc-400">
                  {faculty.about}
                </p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {facultyPrograms.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={{
                        ...program,
                        university,
                        faculty,
                      }}
                      showUniversity={false}
                    />
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
