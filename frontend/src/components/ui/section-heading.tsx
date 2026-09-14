import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps extends ComponentProps<"div"> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeading({
  title,
  description,
  action,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)} {...props}>
      <div className="max-w-2xl">
        <h2 className="text-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm text-zinc-500 sm:text-base dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
