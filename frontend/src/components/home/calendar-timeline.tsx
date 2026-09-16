"use client";

import { motion, type Variants } from "framer-motion";

import type { CalendarEvent } from "@/data/calendar";

interface CalendarTimelineProps {
  events: CalendarEvent[];
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function CalendarTimeline({ events }: CalendarTimelineProps) {
  const activeIndex = events.findIndex((event) => event.status === "active");
  const completedIndex = activeIndex >= 0 ? activeIndex : events.length - 1;

  return (
    <section className="py-6 sm:py-8">
      <motion.div
        className="relative mx-auto mt-8 max-w-5xl cursor-pointer px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
      >
        <div className="relative">
          {/* ФОНОВАЯ ЛИНИЯ */}
          <div className="bg-border/50 pointer-events-none absolute top-6 bottom-6 left-5.75 w-px md:left-1/2 md:-translate-x-1/2" />

          {/* ЗАПОЛНЕННАЯ ЛИНИЯ */}
          {completedIndex > 0 && (
            <motion.div
              initial={{ height: 0 }}
              whileInView={{
                height: `calc(${completedIndex} * (100% / ${Math.max(events.length - 1, 1)}))`,
              }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="via-brand-500 to-brand-600 pointer-events-none absolute top-6 left-5.5 w-0.5 origin-top overflow-hidden rounded-full bg-linear-to-b from-emerald-400 shadow-[0_0_14px_rgba(99,102,241,0.35)] md:left-1/2 md:-translate-x-1/2"
            />
          )}

          {/* СПИСОК СОБЫТИЙ */}
          <div className="space-y-3 md:space-y-4">
            {events.map((event, index) => {
              const isActive = event.status === "active";
              const isCompleted = event.status === "completed";
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className={`group relative flex flex-col md:min-h-30 md:flex-row md:items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* КАРТОЧКА */}
                  <div className="pl-12 md:w-1/2 md:pl-0">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className={`relative min-w-0 origin-center ${
                        isEven
                          ? "md:mr-10 md:ml-auto md:max-w-104 md:text-right"
                          : "md:ml-10 md:max-w-104 md:text-left"
                      }`}
                    >
                      {isActive && (
                        <div className="bg-brand-500/5 pointer-events-none absolute -inset-2.5 rounded-3xl blur-xl" />
                      )}

                      {/* Соединитель от ноды к карточке (только ПК) */}
                      <div
                        className={`pointer-events-none absolute top-1/2 hidden h-px w-10 -translate-y-1/2 md:block ${
                          isEven
                            ? "from-brand-500/40 right-full bg-linear-to-l to-transparent"
                            : "from-brand-500/40 left-full bg-linear-to-r to-transparent"
                        }`}
                      />

                      <div
                        className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-500 sm:rounded-2xl sm:p-5 ${
                          isActive
                            ? "border-brand-500/30 from-brand-500/10 via-background/95 to-background bg-linear-to-br shadow-[0_12px_40px_-18px_rgba(99,102,241,0.28)]"
                            : "border-border/60 bg-surface/60 hover:border-border hover:bg-surface/80 shadow-sm backdrop-blur-xl hover:shadow-md"
                        }`}
                      >
                        <div
                          className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent ${
                            isActive ? "via-brand-500/80" : "via-border"
                          }`}
                        />

                        {isActive && (
                          <motion.div
                            initial={{ x: "-120%", opacity: 0 }}
                            whileInView={{ x: "120%", opacity: [0, 0.5, 0] }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.4, delay: 0.9, ease: "easeInOut" }}
                            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/10 to-transparent"
                          />
                        )}

                        <div className="relative">
                          <span
                            className={`text-lg font-bold tracking-[-0.03em] sm:text-xl ${
                              isActive ? "text-brand-600 dark:text-brand-400" : "text-foreground"
                            }`}
                          >
                            {event.date}
                          </span>

                          <h3
                            className={`mt-1 text-lg font-semibold tracking-[-0.02em] transition-colors duration-300 sm:text-xl ${
                              isActive
                                ? "text-foreground"
                                : "text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400"
                            }`}
                          >
                            {event.title}
                          </h3>

                          <p
                            className={`text-muted mt-1 text-sm leading-5 sm:text-base ${
                              isEven ? "md:ml-auto" : ""
                            }`}
                          >
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* ЦЕНТРАЛЬНАЯ НОДА — строго по центру строки на ПК */}
                  <div className="absolute top-3 left-0 flex size-12 items-center justify-center md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                    <div className="relative z-10 flex items-center justify-center">
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.35, 0.08, 0.35] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="bg-brand-500 absolute size-8 rounded-full blur-md sm:size-10"
                        />
                      )}

                      <motion.div
                        className={`border-background relative flex items-center justify-center rounded-full border-4 transition-all duration-500 ${
                          isActive
                            ? "bg-brand-600 size-8 shadow-[0_0_0_3px_rgba(99,102,241,0.12),0_0_20px_rgba(99,102,241,0.4)] sm:size-9"
                            : isCompleted
                              ? "size-6.5 bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.22)]"
                              : "bg-muted/25 ring-border group-hover:bg-brand-500/60 group-hover:ring-brand-500/30 size-5.5 ring-1"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            animate={{ scale: [1, 1.25, 1], opacity: [1, 0.65, 1] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                            className="size-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                          />
                        )}

                        {isCompleted && (
                          <svg
                            viewBox="0 0 12 12"
                            className="size-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M2.5 6.2 5 8.5 9.5 3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
