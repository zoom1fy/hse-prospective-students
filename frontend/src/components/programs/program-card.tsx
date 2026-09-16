import { CalendarClock, GraduationCap, MapPin, Wallet } from "@/components/ui/icons";
import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { degreeLabels, studyFormLabels } from "@/lib/site";
import { cn, formatCurrency, formatDate, formatNumber, getDaysLeft } from "@/lib/utils";
import type { ProgramWithContext } from "@/types";

interface ProgramCardProps extends ComponentProps<"div"> {
  program: ProgramWithContext;
  showUniversity?: boolean;
}

export function ProgramCard({
  program,
  showUniversity = true,
  className,
  ...props
}: ProgramCardProps) {
  const href = `/universities/${program.university.slug}/programs/${program.slug}`;
  const daysLeft = getDaysLeft(program.deadline);

  return (
    <Card
      className={cn("flex h-full flex-col transition-shadow hover:shadow-md", className)}
      {...props}
    >
      <CardHeader>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge>{degreeLabels[program.degree] ?? program.degree}</Badge>
          <Badge variant="neutral">{studyFormLabels[program.form] ?? program.form}</Badge>
          {daysLeft > 0 ? <Badge variant="success">Набор открыт</Badge> : null}
        </div>
        <CardTitle className="mt-2">{program.name}</CardTitle>
        {showUniversity ? (
          <p className="text-sm text-muted">
            {program.university.shortName} · {program.faculty.shortName}
          </p>
        ) : (
          <p className="text-sm text-muted">{program.faculty.shortName}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <GraduationCap className="size-4 shrink-0 text-muted" />
            <span>{formatNumber(program.budgetPlaces)} бюджет</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <Wallet className="size-4 shrink-0 text-muted" />
            <span>{formatCurrency(program.tuitionPerYear)}/год</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <MapPin className="size-4 shrink-0 text-muted" />
            <span>{program.university.city}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <CalendarClock className="size-4 shrink-0 text-muted" />
            <span>до {formatDate(program.deadline)}</span>
          </div>
        </div>
        <div className="border-border mt-auto flex items-center justify-between border-t pt-4">
          <span className="text-sm text-muted">
            {program.durationYears} года обучения
          </span>
          <a
            href={href}
            className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline"
          >
            Сайт программы
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
