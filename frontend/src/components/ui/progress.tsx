import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export function Progress({ value, max = 100, className }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  return (
    <div
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("bg-surface-muted h-2 w-full overflow-hidden rounded-full", className)}
    >
      <div
        className="bg-brand-600 h-full rounded-full transition-[width]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
