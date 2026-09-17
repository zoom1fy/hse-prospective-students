import type { UniversityFilters } from "@/data/universities";

export interface CatalogFilterValues {
  q: string;
  city: string;
  degree: string;
  form: string;
  direction: string;
  minScore: string;
  budgetOnly: boolean;
}

export const emptyCatalogFilters: CatalogFilterValues = {
  q: "",
  city: "all",
  degree: "all",
  form: "all",
  direction: "all",
  minScore: "",
  budgetOnly: false,
};

export function buildCatalogQuery(values: CatalogFilterValues): string {
  const params = new URLSearchParams();
  const query = values.q.trim();
  if (query) params.set("q", query);
  if (values.city !== "all") params.set("city", values.city);
  if (values.degree !== "all") params.set("degree", values.degree);
  if (values.form !== "all") params.set("form", values.form);
  if (values.direction !== "all") params.set("direction", values.direction);
  if (values.minScore) params.set("minScore", values.minScore);
  if (values.budgetOnly) params.set("budgetOnly", "true");
  return params.toString();
}

export function toProgramFilters(values: CatalogFilterValues): UniversityFilters {
  const minScore = Number(values.minScore);
  return {
    query: values.q.trim() || undefined,
    city: values.city,
    degree: values.degree,
    form: values.form,
    direction: values.direction,
    minScore: values.minScore && !Number.isNaN(minScore) ? minScore : undefined,
    budgetOnly: values.budgetOnly,
  };
}
