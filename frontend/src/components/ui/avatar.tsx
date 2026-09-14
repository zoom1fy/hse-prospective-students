import { cn } from "@/lib/utils";

interface AvatarProps {
  label: string;
  className?: string;
}

export function Avatar({ label, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "bg-brand-600 flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white",
        className,
      )}
      aria-hidden
    >
      {label}
    </div>
  );
}
