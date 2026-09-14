import type { ApplicationUniversityNode } from "@/types";

export const applicationTree: ApplicationUniversityNode[] = [
  {
    id: "app-hse",
    universitySlug: "hse",
    universityName: "Национальный исследовательский университет «Высшая школа экономики»",
    universityShortName: "НИУ ВШЭ",
    city: "Москва",
    faculties: [
      {
        id: "app-hse-fcs",
        facultySlug: "computer-science",
        facultyName: "Факультет компьютерных наук",
        programs: [
          {
            id: "app-hse-fcs-pi",
            programSlug: "applied-informatics",
            programName: "Прикладная информатика",
            status: "under-review",
            priority: 1,
            submittedAt: "2027-06-20",
          },
          {
            id: "app-hse-fcs-se",
            programSlug: "software-engineering",
            programName: "Программная инженерия",
            status: "submitted",
            priority: 2,
            submittedAt: "2027-06-20",
          },
        ],
      },
    ],
  },
  {
    id: "app-mipt",
    universitySlug: "mipt",
    universityName: "Московский физико-технический институт",
    universityShortName: "МФТИ",
    city: "Долгопрудный",
    faculties: [
      {
        id: "app-mipt-fpmi",
        facultySlug: "applied-math-and-informatics",
        facultyName: "Физтех-школа прикладной математики и информатики",
        programs: [
          {
            id: "app-mipt-fpmi-pmi",
            programSlug: "applied-mathematics-and-computer-science",
            programName: "Прикладная математика и информатика",
            status: "submitted",
            priority: 1,
            submittedAt: "2027-06-22",
          },
        ],
      },
    ],
  },
  {
    id: "app-itmo",
    universitySlug: "itmo",
    universityName: "Национальный исследовательский университет ИТМО",
    universityShortName: "ИТМО",
    city: "Санкт-Петербург",
    faculties: [
      {
        id: "app-itmo-ait",
        facultySlug: "information-technologies-and-programming",
        facultyName: "Факультет информационных технологий и программирования",
        programs: [
          {
            id: "app-itmo-ait-se",
            programSlug: "software-engineering",
            programName: "Программная инженерия",
            status: "draft",
            priority: 1,
            submittedAt: "2027-06-25",
          },
        ],
      },
    ],
  },
];

export function countApplications(): number {
  return applicationTree.reduce(
    (sum, university) =>
      sum +
      university.faculties.reduce((facultySum, faculty) => facultySum + faculty.programs.length, 0),
    0,
  );
}
