import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps extends ComponentProps<"div"> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border bg-surface/50 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      <p className="text-foreground text-base font-medium">{title}</p>
      {description ? <p className="text-muted max-w-md text-sm">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
