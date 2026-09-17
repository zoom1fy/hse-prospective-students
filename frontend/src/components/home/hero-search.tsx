"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { MapPin, Search } from "@/components/ui/icons";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { scoreFilterOptions, studyFormLabels } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { ProgramWithContext } from "@/types";

const SUGGESTION_LIMIT = 8;

function programHref(program: ProgramWithContext): string {
  return `/universities/${program.university.slug}/programs/${program.slug}`;
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const needle = query.trim().toLowerCase();
  const index = needle ? text.toLowerCase().indexOf(needle) : -1;
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-200 rounded px-0.5">
        {text.slice(index, index + needle.length)}
      </mark>
      {text.slice(index + needle.length)}
    </>
  );
}

interface HeroSearchProps {
  programs: ProgramWithContext[];
  cities: string[];
}

export function HeroSearch({ programs, cities }: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [direction, setDirection] = useState("");
  const [form, setForm] = useState("");
  const [minScore, setMinScore] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebouncedValue(query, 250);

  const cityOptions = useMemo(
    () => [
      { value: "", label: "Все города" },
      ...cities.map((item) => ({ value: item, label: item })),
    ],
    [cities],
  );

  const directionOptions = useMemo(() => {
    const names = [...new Set(programs.map((program) => program.name))].sort((a, b) =>
      a.localeCompare(b, "ru"),
    );
    return [
      { value: "", label: "Все направления" },
      ...names.map((name) => ({ value: name, label: name })),
    ];
  }, [programs]);

  const formOptions = useMemo(
    () => [
      { value: "", label: "Любая форма" },
      ...Object.entries(studyFormLabels).map(([key, label]) => ({ value: key, label })),
    ],
    [],
  );

  const suggestions = useMemo(() => {
    const needle = debouncedQuery.trim().toLowerCase();
    if (!needle) return [];
    return programs
      .filter((program) => {
        const haystack =
          `${program.name} ${program.university.name} ${program.university.shortName} ${program.faculty.name} ${program.university.city}`.toLowerCase();
        return haystack.includes(needle);
      })
      .slice(0, SUGGESTION_LIMIT);
  }, [debouncedQuery, programs]);

  const showDropdown = open && query.trim().length > 0;

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery, suggestions.length]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function goToCatalog() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (city) params.set("city", city);
    if (direction) params.set("direction", direction);
    if (form) params.set("form", form);
    if (minScore) params.set("minScore", minScore);
    const qs = params.toString();
    router.push(qs ? `/universities?${qs}` : "/universities");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selected = suggestions[activeIndex];
    if (showDropdown && selected) {
      setOpen(false);
      router.push(programHref(selected));
      return;
    }
    goToCatalog();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, -1));
    } else if (event.key === "Enter" && showDropdown && activeIndex >= 0) {
      event.preventDefault();
      const selected = suggestions[activeIndex];
      if (selected) {
        setOpen(false);
        router.push(programHref(selected));
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" role="search">
      <div ref={rootRef} className="relative">
        <div className="border-border bg-surface flex w-full items-center gap-2 rounded-2xl border p-2 shadow-lg">
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search className="text-muted size-5 shrink-0" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Вуз, направление или город"
              className="placeholder:text-muted h-12 w-full bg-transparent text-base outline-none"
              aria-label="Поиск вузов и программ"
              role="combobox"
              aria-expanded={showDropdown}
              aria-controls="hero-search-listbox"
              aria-autocomplete="list"
              aria-activedescendant={
                activeIndex >= 0 ? `hero-search-option-${activeIndex}` : undefined
              }
              autoComplete="off"
            />
          </div>
          <button type="submit" className={buttonVariants({ size: "lg", className: "sm:w-auto" })}>
            Найти
          </button>
        </div>

        {showDropdown ? (
          <div
            id="hero-search-listbox"
            role="listbox"
            className="border-border bg-surface animate-fade-in-down absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border p-1.5 shadow-2xl"
          >
            {suggestions.length > 0 ? (
              <>
                {suggestions.map((program, index) => (
                  <Link
                    key={program.id}
                    id={`hero-search-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    href={programHref(program)}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      index === activeIndex
                        ? "bg-brand-50 dark:bg-brand-950/60"
                        : "hover:bg-muted/15",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="text-foreground block truncate text-sm font-medium">
                        <Highlighted text={program.name} query={query} />
                      </span>
                      <span className="text-muted mt-0.5 block truncate text-xs">
                        <Highlighted text={program.university.shortName} query={query} /> ·{" "}
                        {program.faculty.shortName}
                      </span>
                    </span>
                    <span className="text-muted flex shrink-0 items-center gap-1 text-xs">
                      <MapPin className="size-3.5" />
                      {program.university.city}
                    </span>
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    goToCatalog();
                  }}
                  className="text-brand-600 dark:text-brand-400 hover:bg-muted/15 mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors"
                >
                  Показать все результаты по запросу «{query.trim()}»
                </button>
              </>
            ) : (
              <p className="text-muted px-3 py-4 text-sm">
                Ничего не найдено по запросу «{query.trim()}». Попробуйте изменить запрос или
                воспользуйтесь фильтрами ниже.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DropdownSelect
          value={city}
          onValueChange={setCity}
          placeholder="Все города"
          options={cityOptions}
        />
        <DropdownSelect
          value={direction}
          onValueChange={setDirection}
          placeholder="Все направления"
          options={directionOptions}
        />
        <DropdownSelect
          value={form}
          onValueChange={setForm}
          placeholder="Любая форма"
          options={formOptions}
        />
        <DropdownSelect
          value={minScore}
          onValueChange={setMinScore}
          placeholder="Любой балл"
          options={[...scoreFilterOptions]}
        />
      </div>
    </form>
  );
}
