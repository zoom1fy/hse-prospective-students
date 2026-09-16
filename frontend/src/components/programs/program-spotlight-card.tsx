import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { CalendarClock, GraduationCap, MapPin, Star, Wallet } from "@/components/ui/icons";
import { UniversityImage } from "@/components/ui/university-image";
import { degreeLabels, studyFormLabels } from "@/lib/site";
import { formatCurrency, formatDate, getDaysLeft } from "@/lib/utils";
import type { ProgramWithContext } from "@/types";

interface ProgramSpotlightCardProps {
  program: ProgramWithContext;
}

export function ProgramSpotlightCard({ program }: ProgramSpotlightCardProps) {
  const href = `/universities/${program.university.slug}/programs/${program.slug}`;
  const daysLeft = getDaysLeft(program.deadline);

  return (
    <article className="group hover:border-brand-400/40 relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/80 text-foreground shadow-[0_10px_40px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-neutral-900/70 dark:text-foreground dark:shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] dark:hover:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)]">
      {/* top hairline highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent dark:via-white/20"
      />

      {/* HEADER */}
      <div className="relative h-44 overflow-hidden sm:h-48">
        <UniversityImage
          university={program.university}
          className="absolute inset-0 h-full w-full scale-105 transition-transform duration-600 ease-out group-hover:scale-115"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        {/* rating pill */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full border border-white/40 bg-white/85 px-2.5 py-1 text-xs font-semibold text-foreground shadow-lg backdrop-blur-md">
          <Star className="size-3.5 fill-amber-500 text-amber-500" />
          {program.university.rating.toFixed(1)}
        </div>

        <div className="absolute right-0 bottom-3 left-4">
          <p className="text-lg font-bold tracking-tight text-balance text-white drop-shadow-md">
            {program.university.shortName}
          </p>
          <p className="flex items-center gap-1 text-xs font-medium text-white/85">
            <MapPin className="size-3.5" />
            {program.university.city}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge>{degreeLabels[program.degree] ?? program.degree}</Badge>
          <Badge variant="neutral">{studyFormLabels[program.form] ?? program.form}</Badge>
          {daysLeft > 0 ? (
            <Badge variant="success">
              <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
              Набор открыт
            </Badge>
          ) : null}
        </div>

        <h3 className="mt-3 line-clamp-2 text-lg leading-snug font-semibold tracking-tight">
          {program.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">
          {program.about}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <StatTile
            icon={<GraduationCap className="size-3.5" />}
            label="Бюджетные места"
            value={program.budgetPlaces}
          />
          <StatTile
            icon={<Wallet className="size-3.5" />}
            label="Стоимость / год"
            value={formatCurrency(program.tuitionPerYear)}
          />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 dark:border-white/10">
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <CalendarClock className="size-3.5" />
            до {formatDate(program.deadline)}
          </span>
          <Link
            href={href}
            className="group/link text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 relative inline-flex items-center gap-1 text-sm font-semibold transition-colors"
          >
            <span className="relative">
              Подробнее
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover/link:scale-x-100" />
            </span>
            <svg
              className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>

      {/* bottom glow on hover */}
      <div
        aria-hidden
        className="via-brand-500/60 pointer-events-none absolute inset-x-6 -bottom-px h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </article>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="group-hover:border-brand-400/30 dark:group-hover:border-brand-400/30 relative overflow-hidden rounded-2xl border border-border/50 bg-neutral-50/60 p-3 transition-colors duration-300 dark:border-white/10 dark:bg-white/3">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-white/5"
      />
      <p className="relative flex items-center gap-1.5 text-xs text-muted">
        {icon}
        {label}
      </p>
      <p className="relative mt-0.5 text-lg font-bold tracking-tight">{value}</p>
    </div>
  );
}
