export const siteConfig = {
  name: "Я.Абитуриент",
  shortName: "ЯА",
  description:
    "Агрегатор вузов, направлений и приёмных кампаний: подбор программ, личный кабинет и дерево поданных заявок.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  nav: [
    { href: "/", label: "Главная" },
    { href: "/universities", label: "Вузы и программы" },
  ],
} as const;

export const degreeLabels: Record<string, string> = {
  bachelor: "Бакалавриат",
  specialist: "Специалитет",
  master: "Магистратура",
  postgraduate: "Аспирантура",
};

export const studyFormLabels: Record<string, string> = {
  "full-time": "Очная",
  "part-time": "Заочная",
  evening: "Очно-заочная",
  online: "Онлайн",
};

export const applicationStatusLabels: Record<string, string> = {
  draft: "Черновик",
  submitted: "Заявление подано",
  "under-review": "На рассмотрении",
  invited: "Приглашение",
  enrolled: "Зачислен",
  rejected: "Отказ",
};

export const applicationStatusStyles: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  submitted: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "under-review": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  invited: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  enrolled: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};
