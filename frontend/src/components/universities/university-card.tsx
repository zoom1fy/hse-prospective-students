import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ExternalLink, MapPin, Star } from "@/components/ui/icons";
import { UniversityImage } from "@/components/ui/university-image";
import type { University } from "@/types";

interface UniversityCardProps {
  university: University;
  programCount?: number;
}

export function UniversityCard({ university, programCount }: UniversityCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <UniversityImage university={university} className="h-40 w-full" />
      <CardHeader>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="neutral">
            <MapPin className="mr-1 size-3.5" />
            {university.city}
          </Badge>
          {university.rating > 0 ? (
            <Badge>
              <Star className="mr-1 size-3.5" />
              {university.rating.toFixed(1)}
            </Badge>
          ) : null}
          {typeof programCount === "number" && programCount >= 0 ? (
            <Badge variant="neutral">{programCount} программ</Badge>
          ) : null}
        </div>
        <CardTitle className="mt-2">{university.shortName}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-muted line-clamp-2 text-sm">
          {university.about || "Описание отсутствует."}
        </p>
        <div className="border-border mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <Link
            href={`/universities/${university.slug}`}
            className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline"
          >
            Страница вуза
            <ArrowRight className="ml-1 inline size-4" />
          </Link>
          {university.website ? (
            <a
              href={university.website}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-foreground flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
            >
              Сайт вуза
              <ExternalLink className="size-4" />
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}