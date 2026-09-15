"use client";

import { motion, type Variants } from "framer-motion";

import { ClipboardList, FileText, Search, Check } from "@/components/ui/icons";

const steps = [
  {
    number: 1,
    title: "Выберите направление",
    description: "Изучите программы, сравните вузы и найдите то, что подходит именно вам.",
    Icon: Search,
  },
  {
    number: 2,
    title: "Подготовьте документы",
    description: "Соберите пакет документов: паспорт, СНИЛС, аттестат и результаты ЕГЭ.",
    Icon: FileText,
  },
  {
    number: 3,
    title: "Подайте заявление",
    description:
      "Заполните онлайн-заявку в личном кабинете или подайте документы лично в приёмной комиссии.",
    Icon: ClipboardList,
  },
  {
    number: 4,
    title: "Зачисление",
    description: "Отслеживайте статус заявления и получите приглашение на обучение.",
    Icon: Check,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Steps() {
  return (
    <section className="py-10 sm:py-14">
      <motion.div
        className="relative mx-auto mt-10 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.15,
        }}
      >
        {/* DESKTOP LINE */}
        <div className="bg-border/60 pointer-events-none absolute top-7 right-[6.25%] left-[6.25%] hidden h-px lg:block" />

        {/* ANIMATED DESKTOP LINE */}
        <motion.div
          initial={{
            scaleX: 0,
            opacity: 0,
          }}
          whileInView={{
            scaleX: 1,
            opacity: 1,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 1.6,
            delay: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            transformOrigin: "left",
          }}
          className="bg-brand-500 pointer-events-none absolute top-6.75 right-[6.25%] left-[6.25%] hidden h-0.5 rounded-full shadow-[0_0_14px_rgba(99,102,241,0.35)] lg:block"
        />

        {/* MOBILE VERTICAL LINE */}
        <div className="bg-border/60 pointer-events-none absolute top-7 bottom-7 left-6.75 w-px lg:hidden" />

        <div className="grid gap-5 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;

            return (
              <motion.div key={step.number} variants={cardVariants} className="group relative">
                {/* MOBILE CONNECTOR */}
                {!isLast && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    whileInView={{
                      height: "100%",
                      opacity: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 0.35 + index * 0.18,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="bg-brand-500 pointer-events-none absolute top-14 left-6.75 hidden w-px lg:hidden"
                  />
                )}

                <div className="relative flex gap-4 lg:block">
                  {/* NODE */}
                  <motion.div
                    initial={{
                      scale: 0.5,
                      opacity: 0,
                    }}
                    whileInView={{
                      scale: 1,
                      opacity: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.25 + index * 0.18,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                      scale: 1.12,
                    }}
                    className="border-background bg-brand-600 relative z-20 flex size-14 shrink-0 items-center justify-center rounded-full border-4 text-base font-bold text-white shadow-[0_0_0_1px_rgba(99,102,241,0.2),0_8px_24px_-8px_rgba(99,102,241,0.6)] transition-shadow duration-300 group-hover:shadow-[0_0_0_6px_rgba(99,102,241,0.08),0_14px_34px_-8px_rgba(99,102,241,0.7)] lg:mx-auto"
                  >
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: 0.45 + index * 0.18,
                      }}
                    >
                      {step.number}
                    </motion.span>
                  </motion.div>

                  {/* CARD */}
                  <motion.div
                    whileHover={{
                      y: -6,
                      transition: {
                        duration: 0.25,
                        ease: "easeOut",
                      },
                    }}
                    className="border-border/60 bg-card/50 group-hover:border-brand-500/25 group-hover:bg-card/80 min-w-0 flex-1 rounded-2xl border p-5 shadow-sm backdrop-blur-xl transition-all duration-300 group-hover:shadow-[0_20px_45px_-25px_rgba(99,102,241,0.4)] lg:mt-7 lg:min-h-61.25 lg:p-6"
                  >
                    {/* ICON */}
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.7,
                        rotate: -8,
                      }}
                      whileInView={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: 0.4 + index * 0.18,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotate: 4,
                        transition: {
                          duration: 0.2,
                        },
                      }}
                      className="bg-brand-500/10 text-brand-600 group-hover:bg-brand-500/15 dark:text-brand-400 flex size-10 items-center justify-center rounded-xl transition-colors duration-300"
                    >
                      <step.Icon className="size-5" />
                    </motion.div>

                    {/* TITLE */}
                    <h3 className="group-hover:text-brand-600 dark:group-hover:text-brand-400 mt-4 text-4xl font-semibold tracking-tight transition-colors duration-300">
                      {step.title}
                    </h3>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
