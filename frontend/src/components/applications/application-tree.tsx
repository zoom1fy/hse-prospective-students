"use client";

import Link from "next/link";
import { useState } from "react";

import { StatusBadge } from "@/components/applications/status-badge";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ExternalLink } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { ApplicationUniversityNode } from "@/types";

function ToggleButton({
  expanded,
  onClick,
  label,
}: {
  expanded: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-label={label}
      className="border-border inline-flex size-7 shrink-0 items-center justify-center rounded-md border text-zinc-500 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
    >
      <ChevronDown className={cn("size-4 transition-transform", !expanded && "-rotate-90")} />
    </button>
  );
}

export function ApplicationTree({ data }: { data: ApplicationUniversityNode[] }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((university) => {
        const isUniversityOpen = !collapsed[university.id];
        const programsCount = university.faculties.reduce(
          (sum, faculty) => sum + faculty.programs.length,
          0,
        );

        return (
          <div
            key={university.id}
            className="border-border bg-surface rounded-2xl border p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <ToggleButton
                expanded={isUniversityOpen}
                onClick={() => toggle(university.id)}
                label={isUniversityOpen ? "Свернуть вуз" : "Развернуть вуз"}
              />
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                <Link
                  href={`/universities/${university.universitySlug}`}
                  className="hover:text-brand-600 dark:hover:text-brand-400 font-semibold tracking-tight"
                >
                  {university.universityShortName}
                </Link>
                <Badge variant="neutral">{university.city}</Badge>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {programsCount} программ(ы)
                </span>
              </div>
            </div>

            {isUniversityOpen ? (
              <div className="border-border mt-3 flex flex-col gap-3 border-l border-dashed pl-4 sm:ml-3.5 sm:pl-6">
                {university.faculties.map((faculty) => {
                  const isFacultyOpen = !collapsed[faculty.id];
                  return (
                    <div
                      key={faculty.id}
                      className="rounded-xl bg-zinc-50/60 p-3 dark:bg-zinc-900/50"
                    >
                      <div className="flex items-start gap-3">
                        <ToggleButton
                          expanded={isFacultyOpen}
                          onClick={() => toggle(faculty.id)}
                          label={isFacultyOpen ? "Свернуть факультет" : "Развернуть факультет"}
                        />
                        <Link
                          href={`/universities/${university.universitySlug}#faculty-${faculty.facultySlug}`}
                          className="hover:text-brand-600 dark:hover:text-brand-400 text-sm font-medium"
                        >
                          {faculty.facultyName}
                        </Link>
                      </div>

                      {isFacultyOpen ? (
                        <ul className="border-border mt-2 flex flex-col gap-2 border-l border-dashed pl-4 sm:ml-3.5 sm:pl-6">
                          {faculty.programs.map((program) => (
                            <li key={program.id}>
                              <Link
                                href={`/universities/${university.universitySlug}/programs/${program.programSlug}`}
                                className="group border-border bg-surface hover:border-brand-400 flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 transition-colors"
                              >
                                <span className="flex items-center gap-2 text-sm">
                                  <span className="font-medium">{program.programName}</span>
                                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Приоритет {program.priority}
                                  </span>
                                </span>
                                <span className="flex items-center gap-2">
                                  <StatusBadge status={program.status} />
                                  <ExternalLink className="group-hover:text-brand-600 size-4 text-zinc-400 transition-colors" />
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
