import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ExternalLink, Star } from "@/components/ui/icons";
import { getUniversity, universities } from "@/data/universities";
import { formatCompact } from "@/lib/utils";

export function generateStaticParams() {
  return universities.map((university) => ({ slug: university.slug }));
}

export default async function UniversityLayout({
  params,
  children,
}: {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}) {
  const { slug } = await params;
  const university = getUniversity(slug);

  if (!university) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-border bg-surface border-b">
        <Container className="py-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <span className="bg-brand-600 flex size-14 shrink-0 items-center justify-center rounded-2xl text-base font-bold text-white">
                {university.shortName.slice(0, 3)}
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{university.shortName}</h1>
                <p className="text-muted mt-1 text-sm">
                  {university.city} · основан в {university.founded} г.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge>
                    <Star className="mr-1 size-3.5" />
                    Рейтинг {university.ranking} в России
                  </Badge>
                  <Badge variant="neutral">{formatCompact(university.students)} студентов</Badge>
                </div>
              </div>
            </div>

            <a
              href={university.website}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "secondary" })}
            >
              Официальный сайт
              <ExternalLink className="size-4" />
            </a>
          </div>

          <nav className="mt-6 flex flex-wrap gap-1">
            <Link
              href={`/universities/${university.slug}`}
              className="text-muted hover:bg-muted/25 rounded-lg px-3 py-2 text-sm font-medium"
            >
              О вузе и программах
            </Link>
            <Link
              href="/dashboard/recommendations"
              className="text-muted hover:bg-muted/25 rounded-lg px-3 py-2 text-sm font-medium"
            >
              Подобрать программу
            </Link>
            <Link
              href="/dashboard/applications"
              className="text-muted hover:bg-muted/25 rounded-lg px-3 py-2 text-sm font-medium"
            >
              Мои заявки
            </Link>
          </nav>
        </Container>
      </section>

      {children}
    </div>
  );
}
