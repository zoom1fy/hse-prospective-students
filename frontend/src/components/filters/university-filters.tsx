"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { SlidersHorizontal } from "@/components/ui/icons";
import { degreeLabels, studyFormLabels } from "@/lib/site";

export interface UniversityFilterValues {
  q: string;
  city: string;
  degree: string;
  form: string;
  budgetOnly: boolean;
}

interface UniversityFiltersProps {
  cities: string[];
  values: UniversityFilterValues;
}

export function UniversityFilters({ cities, values }: UniversityFiltersProps) {
  const router = useRouter();
  const [state, setState] = useState(values);

  function apply(next: UniversityFilterValues) {
    const params = new URLSearchParams();
    if (next.q.trim()) params.set("q", next.q.trim());
    if (next.city !== "all") params.set("city", next.city);
    if (next.degree !== "all") params.set("degree", next.degree);
    if (next.form !== "all") params.set("form", next.form);
    if (next.budgetOnly) params.set("budgetOnly", "true");
    router.push(`/universities${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        apply(state);
      }}
      className="border-border bg-surface grid gap-4 rounded-2xl border p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
    >
      <Field label="Поиск" htmlFor="filter-q" className="sm:col-span-2 lg:col-span-4">
        <Input
          id="filter-q"
          value={state.q}
          onChange={(event) => setState({ ...state, q: event.target.value })}
          placeholder="Название программы, вуза или факультета"
        />
      </Field>

      <Field label="Город" htmlFor="filter-city">
        <Select
          id="filter-city"
          value={state.city}
          onChange={(event) => setState({ ...state, city: event.target.value })}
        >
          <option value="all">Все города</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Уровень образования" htmlFor="filter-degree">
        <Select
          id="filter-degree"
          value={state.degree}
          onChange={(event) => setState({ ...state, degree: event.target.value })}
        >
          <option value="all">Любой уровень</option>
          {Object.entries(degreeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Форма обучения" htmlFor="filter-form">
        <Select
          id="filter-form"
          value={state.form}
          onChange={(event) => setState({ ...state, form: event.target.value })}
        >
          <option value="all">Любая форма</option>
          {Object.entries(studyFormLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="flex items-end gap-3">
        <label className="flex h-10 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={state.budgetOnly}
            onChange={(event) => setState({ ...state, budgetOnly: event.target.checked })}
            className="border-border accent-brand-600 size-4 rounded"
          />
          Только бюджет
        </label>
      </div>

      <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-4">
        <Button type="submit">
          <SlidersHorizontal className="size-4" />
          Применить фильтры
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            const empty: UniversityFilterValues = {
              q: "",
              city: "all",
              degree: "all",
              form: "all",
              budgetOnly: false,
            };
            setState(empty);
            apply(empty);
          }}
        >
          Сбросить
        </Button>
      </div>
    </form>
  );
}
