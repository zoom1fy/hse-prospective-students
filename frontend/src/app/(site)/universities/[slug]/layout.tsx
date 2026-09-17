import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ExternalLink, Star } from "@/components/ui/icons";
import { universities } from "@/data/universities";
import { getUniversityBySlug } from "@/lib/api";
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
  const university = await getUniversityBySlug(slug);

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
                  {university.city}
                </p>
              </div>
            </div>

            {university.website ? (
              <a
                href={university.website}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "secondary" })}
              >
                Перейти на сайт вуза
                <ExternalLink className="size-4" />
              </a>
            ) : null}
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
