import type { UserProfile } from "@/types";

export const currentUserProfile: UserProfile = {
  id: "user-1",
  email: "a.smirnova@example.com",
  phone: "+7 (999) 123-45-67",
  fullName: {
    last: "Смирнова",
    first: "Анна",
    middle: "Дмитриевна",
  },
  passport: {
    series: "45 12",
    number: "345678",
    issuedBy: "Отделением УФМС России по г. Москве",
    issuedAt: "2021-08-14",
    departmentCode: "770-001",
  },
  snils: "123-456-789 00",
  education: [
    {
      id: "edu-1",
      title: "Курс «Основы машинного обучения»",
      institution: "Яндекс Образование",
      year: 2025,
    },
    {
      id: "edu-2",
      title: "Летняя школа по олимпиадному программированию",
      institution: "НИУ ВШЭ",
      year: 2024,
    },
  ],
  diplomas: [
    {
      id: "dip-1",
      type: "school",
      title: "Аттестат о среднем общем образовании",
      institution: "ГБОУ Школа № 179",
      year: 2026,
      averageScore: 4.9,
    },
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Всероссийская олимпиада школьников по информатике, призёр",
      level: "national",
      year: 2026,
      points: 100,
    },
    {
      id: "ach-2",
      title: "Олимпиада «Высшая проба» по математике, диплом II степени",
      level: "university",
      year: 2025,
      points: 75,
    },
    {
      id: "ach-3",
      title: "Хакатон IT-Москва, победитель",
      level: "regional",
      year: 2025,
      points: 40,
    },
  ],
};
