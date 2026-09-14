export interface Material {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
}

export const materials: Material[] = [
  {
    id: "choose-direction",
    title: "Как выбрать направление",
    description:
      "Критерии выбора специальности: карьерные перспективы, программа обучения, сравнение факультетов.",
    href: "#",
    icon: "BookOpen",
  },
  {
    id: "admission-campaign",
    title: "Приёмная кампания ВШЭ 2027",
    description:
      "Полный график приёма, требования к документам, проходные баллы прошлых лет и особенности набора.",
    href: "#",
    icon: "FileText",
  },
  {
    id: "ege-olympiads",
    title: "ЕГЭ и олимпиады",
    description:
      "Какие предметы сдавать, минимальные баллы, преимущества победителей олимпиад и особые квоты.",
    href: "#",
    icon: "Award",
  },
  {
    id: "scholarships",
    title: "Стипендии и гранты",
    description:
      "Государственные стипендии, повышенные стипендии за достижения, гранты от работодателей и фондов.",
    href: "#",
    icon: "Wallet",
  },
  {
    id: "career-guidance",
    title: "Профориентация",
    description:
      "Тесты на профориентацию, интервью с выпускниками, обзоры профессий и рынка труда.",
    href: "#",
    icon: "GraduationCap",
  },
];
