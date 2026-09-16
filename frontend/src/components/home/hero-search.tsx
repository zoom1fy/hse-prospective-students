"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Search } from "@/components/ui/icons";
import { getCities, getDirections } from "@/data/universities";
import { studyFormLabels } from "@/lib/site";

const cityOptions = [{ value: "", label: "Все города" }, ...getCities().map((c) => ({ value: c, label: c }))];
const directionOptions = [
  { value: "", label: "Все направления" },
  ...getDirections().map((d) => ({ value: d, label: d })),
];
const formOptions = [
  { value: "", label: "Любая форма" },
  ...Object.entries(studyFormLabels).map(([key, label]) => ({ value: key, label })),
];
const scoreOptions = [
  { value: "", label: "Любой балл" },
  { value: "100", label: "до 100" },
  { value: "95", label: "до 95" },
  { value: "90", label: "до 90" },
  { value: "85", label: "до 85" },
  { value: "80", label: "до 80" },
  { value: "75", label: "до 75" },
  { value: "70", label: "до 70" },
  { value: "65", label: "до 65" },
  { value: "60", label: "до 60" },
];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [direction, setDirection] = useState("");
  const [form, setForm] = useState("");
  const [minScore, setMinScore] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (city) params.set("city", city);
    if (direction) params.set("direction", direction);
    if (form) params.set("form", form);
    if (minScore) params.set("minScore", minScore);
    const qs = params.toString();
    router.push(qs ? `/universities?${qs}` : "/universities");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" role="search">
      {/* Big search bar */}
      <div className="border-border bg-surface flex w-full items-center gap-2 rounded-2xl border p-2 shadow-lg">
        <div className="flex flex-1 items-center gap-2 px-3">
          <Search className="size-5 shrink-0 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Вуз, направление или город"
            className="h-12 w-full bg-transparent text-base outline-none placeholder:text-muted"
            aria-label="Поиск вузов и программ"
          />
        </div>
        <button type="submit" className={buttonVariants({ size: "lg", className: "sm:w-auto" })}>
          Найти
        </button>
      </div>

      {/* 4 selectors */}
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
          options={scoreOptions}
        />
      </div>
    </form>
  );
}