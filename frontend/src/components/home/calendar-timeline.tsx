"use client";

import { motion, type Variants } from "framer-motion";

import { SectionHeading } from "@/components/ui/section-heading";

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
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function CalendarTimeline({ events }: CalendarTimelineProps) {
  const activeIndex = events.findIndex((event) => event.status === "active");

  const completedIndex = activeIndex >= 0 ? activeIndex : events.length - 1;

  return (
    <section className="py-8 sm:py-12">
      <motion.div
        className="relative mx-auto mt-12 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
      >
        {/* TIMELINE */}
        <div className="relative">
          {/* Фоновая линия */}
          <div className="bg-border/50 pointer-events-none absolute top-8 bottom-8 left-5.75 w-px sm:left-7.75" />

          {/* Заполненная линия */}
          {completedIndex > 0 && (
            <motion.div
              initial={{ height: 0 }}
              whileInView={{
                height: `calc(
                  ${completedIndex} * (
                    100% / ${Math.max(events.length - 1, 1)}
                  )
                )`,
              }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 1.6,
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="via-brand-500 to-brand-600 pointer-events-none absolute top-8 left-5.5 w-0.5 origin-top overflow-hidden rounded-full bg-linear-to-b from-emerald-400 shadow-[0_0_14px_rgba(99,102,241,0.35)] sm:left-7.5"
            />
          )}

          {/* Движущийся импульс по линии */}
          {events.length > 1 && (
            <motion.div
              initial={{ y: 0, opacity: 0 }}
              whileInView={{
                y: [0, 90, 180],
                opacity: [0, 1, 0],
              }}
              viewport={{ once: true }}
              transition={{
                duration: 1.8,
                delay: 0.8,
                ease: "easeInOut",
              }}
              className="bg-brand-400 pointer-events-none absolute top-8 left-4.75 z-20 h-8 w-2 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.9)] blur-[3px] sm:left-6.75"
            />
          )}

          <div className="space-y-5 sm:space-y-6">
            {events.map((event, index) => {
              const isActive = event.status === "active";
              const isCompleted = event.status === "completed";

              return (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className="group relative grid grid-cols-[48px_minmax(0,1fr)] gap-3 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-5"
                >
                  {/* NODE */}
                  <div className="relative flex justify-center">
                    <div className="relative z-10 mt-5 flex size-12 items-center justify-center sm:size-16">
                      {/* Active glow */}
                      {isActive && (
                        <motion.div
                          initial={{
                            scale: 0.8,
                            opacity: 0,
                          }}
                          animate={{
                            scale: [1, 1.45, 1],
                            opacity: [0.35, 0.08, 0.35],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="bg-brand-500 absolute size-9 rounded-full blur-lg sm:size-11"
                        />
                      )}

                      {/* Node */}
                      <motion.div
                        whileHover={{
                          scale: 1.1,
                        }}
                        className={`border-background relative flex items-center justify-center rounded-full border-4 transition-all duration-500 ${
                          isActive
                            ? "bg-brand-600 size-9 shadow-[0_0_0_4px_rgba(99,102,241,0.12),0_0_24px_rgba(99,102,241,0.4)] sm:size-10"
                            : isCompleted
                              ? "size-7 bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.22)]"
                              : "bg-muted-foreground/25 ring-border group-hover:bg-brand-500/60 group-hover:ring-brand-500/30 size-6 ring-1"
                        } `}
                      >
                        {isActive && (
                          <motion.span
                            animate={{
                              scale: [1, 1.25, 1],
                              opacity: [1, 0.65, 1],
                            }}
                            transition={{
                              duration: 1.6,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="size-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                          />
                        )}

                        {isCompleted && (
                          <svg
                            viewBox="0 0 12 12"
                            className="size-3.5 text-white"
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

                  {/* CONTENT */}
                  <motion.div
                    whileHover={{
                      y: -2,
                      transition: {
                        duration: 0.25,
                      },
                    }}
                    className="relative min-w-0"
                  >
                    {/* Active glow */}
                    {isActive && (
                      <div className="bg-brand-500/5 pointer-events-none absolute -inset-3 rounded-[28px] blur-2xl" />
                    )}

                    <div
                      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 sm:rounded-3xl sm:p-6 ${
                        isActive
                          ? "border-brand-500/30 from-brand-500/10 via-background/95 to-background bg-linear-to-br shadow-[0_16px_50px_-20px_rgba(99,102,241,0.3)]"
                          : "border-border/60 bg-card/60 hover:border-border hover:bg-card/80 shadow-sm backdrop-blur-xl hover:shadow-lg"
                      } `}
                    >
                      {/* Верхняя линия */}
                      <div
                        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent ${
                          isActive ? "via-brand-500/80" : "via-border"
                        } `}
                      />

                      {/* Shine */}
                      {isActive && (
                        <motion.div
                          initial={{
                            x: "-120%",
                            opacity: 0,
                          }}
                          whileInView={{
                            x: "120%",
                            opacity: [0, 0.5, 0],
                          }}
                          viewport={{
                            once: true,
                          }}
                          transition={{
                            duration: 1.4,
                            delay: 0.9,
                            ease: "easeInOut",
                          }}
                          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/10 to-transparent"
                        />
                      )}

                      <div className="relative">
                        {/* DATE */}
                        <span
                          className={`text-xl font-bold tracking-[-0.03em] sm:text-2xl ${
                            isActive ? "text-brand-600 dark:text-brand-400" : "text-foreground"
                          } `}
                        >
                          {event.date}
                        </span>

                        {/* TITLE */}
                        <h3
                          className={`mt-2 text-xl font-semibold tracking-[-0.02em] transition-colors duration-300 sm:text-2xl ${
                            isActive
                              ? "text-foreground"
                              : "text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400"
                          } `}
                        >
                          {event.title}
                        </h3>

                        {/* DESCRIPTION */}
                        <p className="text-muted-foreground mt-1.5 max-w-xl text-base leading-6 sm:text-lg">
                          {event.description}
                        </p>

                        {/* Active footer */}
                        {isActive && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 6,
                            }}
                            whileInView={{
                              opacity: 1,
                              y: 0,
                            }}
                            viewport={{
                              once: true,
                            }}
                            transition={{
                              delay: 1,
                              duration: 0.4,
                            }}
                            className="bg-brand-500/50 mt-4 h-px w-16"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
