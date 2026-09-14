import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "@/components/ui/icons";
import type { University } from "@/types";
import { cn, formatCompact, initials } from "@/lib/utils";

export function UniversityCard({
  university,
  className,
}: {
  university: University;
  className?: string;
}) {
  return (
    <Card className={cn("flex h-full flex-col transition-shadow hover:shadow-md", className)}>
      <CardHeader className="flex-row items-center gap-3">
        <span className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-200 flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold">
          {initials(university.shortName)}
        </span>
        <div className="min-w-0">
          <CardTitle className="truncate">{university.shortName}</CardTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {university.city} · с {university.founded}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-2 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
          {university.about}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {university.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="neutral">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="border-border flex items-center justify-between border-t pt-4 text-sm">
          <span className="inline-flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <Users className="size-4" />
            {formatCompact(university.students)} студентов
          </span>
          <Link
            href={`/universities/${university.slug}`}
            className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
          >
            Перейти на сайт вуза
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
