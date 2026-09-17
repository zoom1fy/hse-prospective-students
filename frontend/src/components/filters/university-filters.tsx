"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { RefreshCw, Search } from "@/components/ui/icons";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { buildCatalogQuery, emptyCatalogFilters, type CatalogFilterValues } from "@/lib/filters";
import { degreeLabels, scoreFilterOptions, studyFormLabels } from "@/lib/site";

interface UniversityFiltersProps {
  cities: string[];
  directions: string[];
  values: CatalogFilterValues;
}

export function UniversityFilters({ cities, directions, values }: UniversityFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<CatalogFilterValues>(values);
  const debouncedQuery = useDebouncedValue(state.q, 350);
  const lastRequested = useRef(buildCatalogQuery(values));

  const valuesKey = buildCatalogQuery(values);

  useEffect(() => {
    if (valuesKey === lastRequested.current) return;
    lastRequested.current = valuesKey;
    setState(values);
  }, [valuesKey, values]);

  function apply(next: CatalogFilterValues) {
    const query = buildCatalogQuery(next);
    if (query === lastRequested.current) return;
    lastRequested.current = query;
    startTransition(() => {
      router.replace(`/universities${query ? `?${query}` : ""}`, { scroll: false });
    });
  }

  useEffect(() => {
    apply({ ...state, q: debouncedQuery });
  }, [debouncedQuery]);

  function update(patch: Partial<CatalogFilterValues>) {
    const next = { ...state, ...patch };
    setState(next);
    if (patch.q === undefined) apply(next);
  }

  function reset() {
    setState(emptyCatalogFilters);
    apply(emptyCatalogFilters);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        apply({ ...state, q: state.q.trim() });
      }}
      className="border-border bg-surface grid gap-4 rounded-2xl border p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
    >
      <Field label="Поиск" htmlFor="filter-q" className="sm:col-span-2 lg:col-span-4">
        <div className="relative">
          <Search className="text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="filter-q"
            value={state.q}
            onChange={(event) => update({ q: event.target.value })}
            placeholder="Название программы, вуза или факультета"
            className="pl-9"
            autoComplete="off"
          />
          {isPending ? (
            <RefreshCw className="text-muted absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin" />
          ) : null}
        </div>
      </Field>

      <Field label="Город" htmlFor="filter-city">
        <Select
          id="filter-city"
          value={state.city}
          onChange={(event) => update({ city: event.target.value })}
        >
          <option value="all">Все города</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Направление" htmlFor="filter-direction">
        <Select
          id="filter-direction"
          value={state.direction}
          onChange={(event) => update({ direction: event.target.value })}
        >
          <option value="all">Все направления</option>
          {directions.map((direction) => (
            <option key={direction} value={direction}>
              {direction}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Уровень образования" htmlFor="filter-degree">
        <Select
          id="filter-degree"
          value={state.degree}
          onChange={(event) => update({ degree: event.target.value })}
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
          onChange={(event) => update({ form: event.target.value })}
        >
          <option value="all">Любая форма</option>
          {Object.entries(studyFormLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Проходной балл (сумма ЕГЭ)" htmlFor="filter-score">
        <Select
          id="filter-score"
          value={state.minScore}
          onChange={(event) => update({ minScore: event.target.value })}
        >
          {scoreFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="flex items-end">
        <label className="flex h-10 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={state.budgetOnly}
            onChange={(event) => update({ budgetOnly: event.target.checked })}
            className="border-border accent-brand-600 size-4 rounded"
          />
          Только бюджет
        </label>
      </div>

      <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-4">
        <Button type="button" variant="ghost" onClick={reset}>
          Сбросить фильтры
        </Button>
      </div>
    </form>
  );
}
