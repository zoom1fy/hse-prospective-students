import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const fieldStyles =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:cursor-not-allowed disabled:opacity-60";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldStyles, "h-10", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldStyles, "min-h-24 resize-y", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(fieldStyles, "h-10", className)} {...props} />;
}

interface FieldProps extends ComponentProps<"div"> {
  label: string;
  htmlFor?: string;
  hint?: string;
}

export function Field({ label, htmlFor, hint, className, children, ...props }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      <label htmlFor={htmlFor} className="text-foreground text-sm font-medium">
        {label}
      </label>
      {children}
      {hint ? <p className="text-muted text-xs">{hint}</p> : null}
    </div>
  );
}
