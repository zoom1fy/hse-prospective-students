import { twMerge } from "tailwind-merge";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(classes.filter(Boolean).join(" "));
}

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const compactFormatter = new Intl.NumberFormat("ru-RU", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatDate(value: string | Date): string {
  return dateFormatter.format(new Date(value));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}

export function initials(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getDaysLeft(deadline: string): number {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
