import { applicationStatusLabels, applicationStatusStyles } from "@/lib/site";
import type { ApplicationStatus } from "@/types";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        applicationStatusStyles[status],
        className,
      )}
    >
      {applicationStatusLabels[status]}
    </span>
  );
}
