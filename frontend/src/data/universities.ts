import type { Faculty, Program, ProgramWithContext, University } from "@/types";

export const universities: University[] = [
  {
    id: "hse",
    slug: "hse",
    name: "Национальный исследовательский университет «Высшая школа экономики»",
    shortName: "НИУ ВШЭ",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HSE_new_building_%282015-01-22%29_01.jpg",
    city: "Москва",
    founded: 1992,
    ranking: 1,
    rating: 4.8,
    students: 52000,
    about:
      "Ведущий исследовательский университет в области экономики, социальных и компьютерных наук. Кампусы в Москве, Санкт-Петербурге, Нижнем Новгороде и Перми.",
    tags: ["Информатика", "Экономика", "Социальные науки", "Дизайн"],
    website: "https://www.hse.ru",
    facultyIds: ["hse-fcs", "hse-fes"],
  },
  {
    id: "msu",
    slug: "msu",
    name: "Московский государственный университет имени М. В. Ломоносова",
    shortName: "МГУ",
    logo: "https://upload.wikimedia.org/wikipedia/en/6/62/Moscow_State_University_CoA.png",
    city: "Москва",
    founded: 1755,
    ranking: 2,
    rating: 4.7,
    students: 40000,
    about:
      "Старейший университет России, крупнейший научно-образовательный центр страны с широким спектром естественно-научных и гуманитарных направлений.",
    tags: ["Математика", "Физика", "Естественные науки", "Экономика"],
    website: "https://www.msu.ru",
    facultyIds: ["msu-vmk", "msu-econ"],
  },
  {
    id: "mipt",
    slug: "mipt",
    name: "Московский физико-технический институт",
    shortName: "МФТИ",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Mipt_phystech.jpg",
    city: "Долгопрудный",
    founded: 1951,
    ranking: 3,
    rating: 4.9,
    students: 7000,
    about:
      "Легендарный «Физтех» с уникальной системой обучения в связке с научными институтами. Сильнейшая подготовка по физике, математике и IT.",
    tags: ["Физика", "Математика", "IT", "Искусственный интеллект"],
    website: "https://mipt.ru",
    facultyIds: ["mipt-fpmi"],
  },
  {
    id: "itmo",
    slug: "itmo",
    name: "Национальный исследовательский университет ИТМО",
    shortName: "ИТМО",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/ITMO_University%27s_main_building%2C_August_2016.jpg",
    city: "Санкт-Петербург",
    founded: 1900,
    ranking: 4,
    rating: 4.8,
    students: 15000,
    about:
      "Семь раз признанный лучшим вузом России в сфере IT. Лидер в олимпиадном программировании и междисциплинарных исследованиях.",
    tags: ["IT", "Программирование", "Робототехника", "Фотоника"],
    website: "https://itmo.ru",
    facultyIds: ["itmo-ait"],
  },
  {
    id: "spbu",
    slug: "spbu",
    name: "Санкт-Петербургский государственный университет",
    shortName: "СПбГУ",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/76/Coat_of_arms_of_SPbU.svg/250px-Coat_of_arms_of_SPbU.svg.png",
    city: "Санкт-Петербург",
    founded: 1724,
    ranking: 5,
    rating: 4.5,
    students: 30000,
    about:
      "Один из старейших и крупнейших университетов России, богатая история математической и естественно-научной школ.",
    tags: ["Математика", "Естественные науки", "Гуманитарные науки"],
    website: "https://spbu.ru",
    facultyIds: ["spbu-mathmech"],
  },
  {
    id: "bmstu",
    slug: "bmstu",
    name: "Московский государственный технический университет имени Н. Э. Баумана",
    shortName: "МГТУ им. Баумана",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/%D0%9C%D0%93%D0%A2%D0%A3_%D0%B8%D0%BC.%D0%91%D0%B0%D1%83%D0%BC%D0%B0%D0%BD%D0%B0%2C_%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B5_%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5_%2821221993236%29.jpg",
    city: "Москва",
    founded: 1830,
    ranking: 6,
    rating: 4.6,
    students: 20000,
    about:
      "Ведущий инженерный университет страны. Готовит специалистов мирового уровня в области техники, информатики и систем управления.",
    tags: ["Инженерия", "Информатика", "Робототехника", "Аэрокосмос"],
    website: "https://bmstu.ru",
    facultyIds: ["bmstu-iu"],
  },
];

const faculties: Faculty[] = [
  {
    id: "hse-fcs",
    slug: "computer-science",
    name: "Факультет компьютерных наук",
    shortName: "ФКН",
    about:
      "Совместный факультет НИУ ВШЭ и Яндекса. Программы по современным направлениям computer science и software engineering.",
  },
  {
    id: "hse-fes",
    slug: "economics",
    name: "Факультет экономических наук",
    shortName: "ФЭН",
    about: "Одна из сильнейших экономических школ России с международными программами.",
  },
  {
    id: "msu-vmk",
    slug: "computational-mathematics",
    name: "Факультет вычислительной математики и кибернетики",
    shortName: "ВМК",
    about: "Классическая школа прикладной математики и кибернетики МГУ.",
  },
  {
    id: "msu-econ",
    slug: "economics",
    name: "Экономический факультет",
    shortName: "Экономический факультет",
    about: "Фундаментальная экономическая подготовка с сильной математической базой.",
  },
  {
    id: "mipt-fpmi",
    slug: "applied-math-and-informatics",
    name: "Физтех-школа прикладной математики и информатики",
    shortName: "ФПМИ",
    about: "Объединение сильнейших кафедр МФТИ в области математики, IT и ИИ.",
  },
  {
    id: "itmo-ait",
    slug: "information-technologies-and-programming",
    name: "Факультет информационных технологий и программирования",
    shortName: "ФИТиП",
    about: "Кузница чемпионов мира по олимпиадному программированию.",
  },
  {
    id: "spbu-mathmech",
    slug: "mathematics-and-mechanics",
    name: "Математико-механический факультет",
    shortName: "Матмех",
    about: "Легендарный матмех СПбГУ с трёхсотлетней научной традицией.",
  },
  {
    id: "bmstu-iu",
    slug: "informatics-and-control-systems",
    name: "Факультет информатики и систем управления",
    shortName: "ИУ",
    about: "Инженерные программы по вычислительной технике, робототехнике и ПО.",
  },
];

const programs: Program[] = [
  {
    id: "hse-fcs-pi",
    slug: "applied-informatics",
    name: "Прикладная информатика",
    about:
      "Программа готовит инженеров данных и разработчиков, способных проектировать информационные системы полного цикла.",
    degree: "bachelor",
    form: "full-time",
    durationYears: 4,
    budgetPlaces: 180,
    paidPlaces: 120,
    tuitionPerYear: 480000,
    minScore: 78,
    deadline: "2027-07-25",
    languages: ["Русский", "Английский"],
    exams: ["Математика (профиль)", "Информатика", "Русский язык"],
    career: ["Backend-разработчик", "Аналитик данных", "ML-инженер", "Продуктовый менеджер"],
    universityId: "hse",
    facultyId: "hse-fcs",
  },
  {
    id: "hse-fcs-se",
    slug: "software-engineering",
    name: "Программная инженерия",
    about:
      "Проектирование и разработка сложных программных систем: архитектура, тестирование, DevOps и управление продуктом.",
    degree: "bachelor",
    form: "full-time",
    durationYears: 4,
    budgetPlaces: 120,
    paidPlaces: 90,
    tuitionPerYear: 520000,
    minScore: 82,
    deadline: "2027-07-25",
    languages: ["Русский", "Английский"],
    exams: ["Математика (профиль)", "Информатика", "Русский язык"],
    career: ["Software Engineer", "Техлид", "DevOps-инженер", "Архитектор ПО"],
    universityId: "hse",
    facultyId: "hse-fcs",
  },
  {
    id: "hse-fcs-ds",
    slug: "data-science",
    name: "Науки о данных",
    about:
      "Магистерская программа о машинном обучении, больших данных и построении интеллектуальных систем принятия решений.",
    degree: "master",
    form: "full-time",
    durationYears: 2,
    budgetPlaces: 60,
    paidPlaces: 40,
    tuitionPerYear: 560000,
    minScore: 85,
    deadline: "2027-08-10",
    languages: ["Русский", "Английский"],
    exams: ["Портфолио", "Собеседование"],
    career: ["Data Scientist", "ML-инженер", "Исследователь", "Руководитель AI-направления"],
    universityId: "hse",
    facultyId: "hse-fcs",
  },
  {
    id: "hse-fes-econ",
    slug: "economics",
    name: "Экономика",
    about:
      "Современная экономическая теория, эконометрика и анализ данных с акцентом на практические исследования.",
    degree: "bachelor",
    form: "full-time",
    durationYears: 4,
    budgetPlaces: 250,
    paidPlaces: 300,
    tuitionPerYear: 450000,
    minScore: 75,
    deadline: "2027-07-25",
    languages: ["Русский", "Английский"],
    exams: ["Математика (профиль)", "Обществознание", "Русский язык"],
    career: ["Аналитик", "Экономист", "Инвестиционный аналитик", "Консультант"],
    universityId: "hse",
    facultyId: "hse-fes",
  },
  {
    id: "msu-vmk-pmi",
    slug: "applied-mathematics",
    name: "Прикладная математика и информатика",
    about:
      "Фундаментальная математическая подготовка в сочетании с программированием и вычислительными методами.",
    degree: "bachelor",
    form: "full-time",
    durationYears: 4,
    budgetPlaces: 300,
    paidPlaces: 80,
    tuitionPerYear: 430000,
    minScore: 90,
    deadline: "2027-07-20",
    languages: ["Русский"],
    exams: ["Математика (профиль)", "Информатика", "Русский язык"],
    career: ["Разработчик", "Исследователь", "Аналитик", "Преподаватель"],
    universityId: "msu",
    facultyId: "msu-vmk",
  },
  {
    id: "msu-econ-econ",
    slug: "economics",
    name: "Экономика",
    about: "Классическое экономическое образование с глубокой математической базой.",
    degree: "bachelor",
    form: "full-time",
    durationYears: 4,
    budgetPlaces: 200,
    paidPlaces: 150,
    tuitionPerYear: 420000,
    minScore: 80,
    deadline: "2027-07-20",
    languages: ["Русский"],
    exams: ["Математика (профиль)", "Обществознание", "Русский язык"],
    career: ["Экономист", "Финансовый аналитик", "Банковский специалист"],
    universityId: "msu",
    facultyId: "msu-econ",
  },
  {
    id: "mipt-fpmi-pmi",
    slug: "applied-mathematics-and-computer-science",
    name: "Прикладная математика и информатика",
    about: "Программа Физтеха с индивидуальной траекторией и научной работой в институтах РАН.",
    degree: "bachelor",
    form: "full-time",
    durationYears: 4,
    budgetPlaces: 220,
    paidPlaces: 30,
    tuitionPerYear: 600000,
    minScore: 92,
    deadline: "2027-07-22",
    languages: ["Русский", "Английский"],
    exams: ["Математика (профиль)", "Физика", "Русский язык"],
    career: ["Исследователь", "Разработчик", "Инженер-математик", "Учёный"],
    universityId: "mipt",
    facultyId: "mipt-fpmi",
  },
  {
    id: "itmo-ait-se",
    slug: "software-engineering",
    name: "Программная инженерия",
    about: "Практико-ориентированная программа с фокусом на промышленной разработке и алгоритмах.",
    degree: "bachelor",
    form: "full-time",
    durationYears: 4,
    budgetPlaces: 150,
    paidPlaces: 100,
    tuitionPerYear: 470000,
    minScore: 76,
    deadline: "2027-07-18",
    languages: ["Русский", "Английский"],
    exams: ["Математика (профиль)", "Информатика", "Русский язык"],
    career: ["Разработчик", "Алгоритмист", "Team Lead", "CTO"],
    universityId: "itmo",
    facultyId: "itmo-ait",
  },
  {
    id: "spbu-mathmech-math",
    slug: "mathematics",
    name: "Математика",
    about: "Глубокая подготовка по чистой и прикладной математике в старейшей школе России.",
    degree: "bachelor",
    form: "full-time",
    durationYears: 4,
    budgetPlaces: 160,
    paidPlaces: 60,
    tuitionPerYear: 380000,
    minScore: 88,
    deadline: "2027-07-20",
    languages: ["Русский"],
    exams: ["Математика (профиль)", "Информатика", "Русский язык"],
    career: ["Математик", "Аналитик", "Разработчик", "Исследователь"],
    universityId: "spbu",
    facultyId: "spbu-mathmech",
  },
  {
    id: "bmstu-iu-ivt",
    slug: "computing-machines-and-software",
    name: "Вычислительные машины, комплексы, системы и сети",
    about:
      "Инженерная программа о проектировании вычислительной техники, встраиваемых систем и робототехники.",
    degree: "specialist",
    form: "full-time",
    durationYears: 5.5,
    budgetPlaces: 140,
    paidPlaces: 70,
    tuitionPerYear: 400000,
    minScore: 70,
    deadline: "2027-07-15",
    languages: ["Русский"],
    exams: ["Математика (профиль)", "Физика", "Русский язык"],
    career: ["Инженер-программист", "Embedded-разработчик", "Робототехник", "Системный инженер"],
    universityId: "bmstu",
    facultyId: "bmstu-iu",
  },
];

const universityById = new Map(universities.map((item) => [item.id, item]));
const facultyById = new Map(faculties.map((item) => [item.id, item]));

export function getUniversity(slug: string): University | undefined {
  return universities.find((item) => item.slug === slug);
}

export function getFaculties(university: University): Faculty[] {
  return university.facultyIds
    .map((id) => facultyById.get(id))
    .filter((item): item is Faculty => Boolean(item));
}

export function getProgramsByFaculty(facultyId: string): Program[] {
  return programs.filter((item) => item.facultyId === facultyId);
}

export function getProgram(universitySlug: string, programSlug: string): Program | undefined {
  const university = getUniversity(universitySlug);
  if (!university) return undefined;
  return programs.find((item) => item.universityId === university.id && item.slug === programSlug);
}

export function withContext(program: Program): ProgramWithContext | undefined {
  const university = universityById.get(program.universityId);
  const faculty = facultyById.get(program.facultyId);
  if (!university || !faculty) return undefined;
  return { ...program, university, faculty };
}

export function getAllProgramsWithContext(): ProgramWithContext[] {
  return programs.map(withContext).filter((item): item is ProgramWithContext => Boolean(item));
}

export interface UniversityFilters {
  query?: string;
  city?: string;
  degree?: string;
  form?: string;
  direction?: string;
  minScore?: number;
  budgetOnly?: boolean;
}

export function getCities(): string[] {
  return [...new Set(universities.map((item) => item.city))].sort((a, b) =>
    a.localeCompare(b, "ru"),
  );
}

export function getDirections(): string[] {
  return [...new Set(programs.map((item) => item.name))].sort((a, b) => a.localeCompare(b, "ru"));
}
