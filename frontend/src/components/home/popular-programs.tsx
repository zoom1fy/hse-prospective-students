"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

import { ProgramSpotlightCard } from "@/components/programs/program-spotlight-card";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import type { ProgramWithContext } from "@/types";

const easing = [0.22, 1, 0.36, 1] as const;

const slotStyle = (offset: number) => ({
  x: `${offset * 100}%`,
  scale: Math.max(1 - Math.abs(offset) * 0.18, 0.72),
  opacity: Math.max(0, 1 - Math.abs(offset) * 0.35),
  rotateY: -offset * 12,
  filter: `blur(${Math.min(Math.abs(offset) * 2, 6)}px)`,
});

const slotZIndex = (offset: number) => Math.max(0, 30 - Math.abs(offset) * 10);

function mod(value: number, size: number): number {
  return ((value % size) + size) % size;
}

const slotOffsets = [-2, -1, 0, 1, 2];

interface PopularProgramsCarouselProps {
  programs: ProgramWithContext[];
}

export function PopularProgramsCarousel({ programs }: PopularProgramsCarouselProps) {
  const count = programs.length;
  const [[active, direction], setActive] = useState<[number, number]>([0, 0]);

  const go = useCallback((dir: number) => {
    setActive(([current]) => [current + dir, dir]);
  }, []);

  if (count === 0) return null;

  const transition = {
    type: "spring",
    stiffness: 220,
    damping: 30,
    mass: 0.9,
  } as const;

  return (
    <div className="relative">
      {/* ambient glow */}
      <div
        aria-hidden
        className="from-brand-500/20 via-brand-400/10 to-brand-500/20 pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-72 max-w-3xl -translate-y-1/2 rounded-full bg-linear-to-r blur-3xl"
      />

      <div className="relative">
        <div className="overflow-hidden py-6">
          <div className="relative mx-auto min-h-120 max-w-5xl" style={{ perspective: 2500 }}>
            <AnimatePresence custom={direction} initial={false}>
              {slotOffsets.map((offset) => {
                const program = programs[mod(active + offset, count)];
                const entering = Math.abs(offset) === 2;
                const initial = entering ? slotStyle(offset > 0 ? 3 : -3) : slotStyle(offset);
                const exit = direction > 0 ? slotStyle(-3) : slotStyle(3);

                return (
                  <div
                    key={program.id}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ zIndex: slotZIndex(offset) }}
                  >
                    <motion.div
                      initial={initial}
                      animate={slotStyle(offset)}
                      exit={exit}
                      transition={transition}
                      className="h-full w-[min(84vw,22rem)] will-change-transform"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <ProgramSpotlightCard program={program} />
                    </motion.div>
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Предыдущие программы"
          className="group hover:border-brand-400/60 hover:text-brand-600 focus-visible:ring-brand-400 dark:hover:text-brand-400 text-foreground dark:text-foreground absolute top-1/2 left-2 z-40 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.18)] focus-visible:ring-2 focus-visible:outline-none sm:left-3 lg:-left-6 dark:border-white/10 dark:bg-neutral-900/70 dark:hover:bg-neutral-900"
        >
          <ChevronLeft className="group-hover:-scale-0.5 size-5 transition-transform duration-300" />
        </button>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Следующие программы"
          className="group hover:border-brand-400/60 hover:text-brand-600 focus-visible:ring-brand-400 dark:hover:text-brand-400 text-foreground dark:text-foreground absolute top-1/2 right-2 z-40 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.18)] focus-visible:ring-2 focus-visible:outline-none sm:right-3 lg:-right-6 dark:border-white/10 dark:bg-neutral-900/70 dark:hover:bg-neutral-900"
        >
          <ChevronRight className="group-hover:scale-0.5 size-5 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}
