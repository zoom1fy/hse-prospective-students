export interface CalendarEvent {
  id: string;
  date: string;
  dateSort: string;
  title: string;
  description: string;
  status: "completed" | "active" | "upcoming";
}

export const calendarEvents: CalendarEvent[] = [
  {
    id: "start",
    date: "20 июня 2027",
    dateSort: "2027-06-20",
    title: "Начало приёма заявлений",
    description:
      "Открыта подача заявлений на бакалавриат и специалитет. Подайте документы через личный кабинет или в приёмной комиссии.",
    status: "active",
  },
  {
    id: "bachelor-deadline",
    date: "25 июля 2027",
    dateSort: "2027-07-25",
    title: "Срок подачи документов (очная форма)",
    description: "Последний день подачи заявлений на очные программы бакалавриата и специалитета.",
    status: "upcoming",
  },
  {
    id: "enrollment-first",
    date: "28 июля 2027",
    dateSort: "2027-07-28",
    title: "Приоритетное зачисление",
    description:
      "Зачисление по результатам олимпиад, особых квот и целевого набора. Приоритетные списки публикуются на сайте приёмной комиссии.",
    status: "upcoming",
  },
  {
    id: "main-enrollment",
    date: "30 июля 2027",
    dateSort: "2027-07-30",
    title: "Основной этап зачисления",
    description:
      "Зачисление по конкурсу баллов аттестата и ЕГЭ. Списки зачисленных публикуются в личном кабинете.",
    status: "upcoming",
  },
  {
    id: "magistratura-deadline",
    date: "10 августа 2027",
    dateSort: "2027-08-10",
    title: "Срок подачи документов (магистратура)",
    description:
      "Дедлайн подачи заявлений на магистерские программы. Вступительные испытания проводятся в формате, определённом вузом.",
    status: "upcoming",
  },
  {
    id: "final-enrollment",
    date: "15 августа 2027",
    dateSort: "2027-08-15",
    title: "Окончание зачисления",
    description:
      "Финальный этап зачисления на вакантные места. Завершается приёмная кампания 2027 года.",
    status: "upcoming",
  },
];
