import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const variants = {
  default: "bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-200",
  neutral: "bg-surface-muted text-foreground",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  outline: "border border-border text-foreground",
} as const;

interface BadgeProps extends ComponentProps<"span"> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
