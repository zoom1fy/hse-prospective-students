import type { UserProfile } from "@/types";

export const currentUserProfile: UserProfile = {
  id: "user-1",
  email: "a.smirnova@example.com",
  phone: "+7 (999) 123-45-67",
  region: "Москва",
  education: "11 классов, курсы «Основы машинного обучения» (Яндекс Образование)",
  fullName: {
    last: "Смирнова",
    first: "Анна",
    middle: "Дмитриевна",
  },
  diplomas: [
    {
      id: "dip-1",
      typeId: 1,
      typeName: "Аттестат",
      name: "Аттестат о среднем общем образовании",
      institution: "ГБОУ Школа № 179",
      year: 2026,
      averageScore: 4.9,
    },
  ],
  achievements: [
    {
      id: "ach-1",
      name: "Всероссийская олимпиада школьников по информатике, призёр",
      category: "Олимпиады",
    },
    {
      id: "ach-2",
      name: "Олимпиада «Высшая проба» по математике, диплом II степени",
      category: "Олимпиады",
    },
    {
      id: "ach-3",
      name: "Хакатон IT-Москва, победитель",
      category: "Академические успехи",
    },
  ],
};
