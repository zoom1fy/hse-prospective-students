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
      <div className="max-w-6xl">
        <h2 className="text-heading text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-6xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm text-muted sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
