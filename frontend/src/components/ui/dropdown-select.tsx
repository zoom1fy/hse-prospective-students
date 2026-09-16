"use client";

import { useEffect, useRef, useState } from "react";

import { Check, ChevronDown } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: DropdownOption[];
  className?: string;
}

export function DropdownSelect({
  value,
  onValueChange,
  placeholder,
  options,
  className,
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "bg-surface flex h-12 w-full items-center justify-between gap-2 rounded-xl border px-4 text-left text-sm shadow-sm transition outline-none",
          "focus-visible:ring-brand-500/30 focus-visible:border-brand-500 focus-visible:ring-2",
          open
            ? "border-brand-500 ring-brand-500/30 ring-2"
            : "border-border hover:border-brand-300 dark:hover:border-brand-700",
          !selected && "text-muted",
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown
          className={cn("text-muted size-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          className="border-border bg-surface animate-fade-in-down absolute top-full left-0 z-10 mt-2 max-h-64 w-full overflow-auto rounded-xl border p-1.5 shadow-xl"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                type="button"
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onValueChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors outline-none",
                  isSelected
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-200"
                    : "text-foreground hover:bg-brand-50 focus-visible:bg-brand-50 dark:hover:bg-brand-950 dark:focus-visible:bg-brand-950",
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected ? <Check className="size-4 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
