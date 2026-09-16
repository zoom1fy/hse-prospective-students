"use client";

import Image from "next/image";
import { useState } from "react";

import { cn, initials } from "@/lib/utils";
import type { University } from "@/types";

interface UniversityImageProps {
  university: University;
  className?: string;
}

export function UniversityImage({ university, className }: UniversityImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(university.logo) && !failed;

  return (
    <div className={cn("bg-brand-700 relative overflow-hidden", className)}>
      {showImage ? (
        <Image
          src={university.logo as string}
          alt={`${university.shortName} — ${university.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          priority={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="from-brand-950 via-brand-800 to-brand-600 dark:from-brand-950 dark:via-brand-900 dark:to-brand-700 absolute inset-0 flex flex-col items-center justify-center gap-2 bg-linear-to-br">
          <span className="text-4xl font-extrabold tracking-tight text-white/95">
            {initials(university.shortName) || "ВУЗ"}
          </span>
          <span className="max-w-[80%] truncate text-xs font-medium text-white/70">
            {university.shortName}
          </span>
        </div>
      )}
    </div>
  );
}