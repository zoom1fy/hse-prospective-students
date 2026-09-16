import type { ApplicationStatus, Degree, StudyForm } from "@/types";

const regionNames: Record<number, string> = {
  1: "Москва",
  2: "Санкт-Петербург",
  3: "Новосибирск",
  4: "Екатеринбург",
  5: "Казань",
  6: "Нижний Новгород",
  7: "Томск",
  8: "Ростов-на-Дону",
  9: "Красноярск",
  10: "Самара",
  11: "Воронеж",
  12: "Иркутск",
  13: "Крым",
};

const degreeByEducationLevel: Record<number, Degree> = {
  1: "bachelor",
  2: "specialist",
  3: "master",
  4: "postgraduate",
};

const formByStudyType: Record<number, StudyForm> = {
  1: "full-time",
  2: "evening",
  3: "part-time",
};

const statusByStatementName: Record<string, ApplicationStatus> = {
  Черновик: "draft",
  Отправлено: "submitted",
  "На рассмотрении": "under-review",
  "Приглашение на экзамен": "invited",
  Зачислен: "enrolled",
  Отклонено: "rejected",
  Отозвано: "rejected",
};

export function regionName(id: number): string {
  return regionNames[id] ?? "—";
}

export function toDegree(id: number | null | undefined): Degree {
  return (id != null && degreeByEducationLevel[id]) || "bachelor";
}

export function toStudyForm(id: number | null | undefined): StudyForm {
  return (id != null && formByStudyType[id]) || "full-time";
}

export function toApplicationStatusByName(name: string): ApplicationStatus {
  return statusByStatementName[name] ?? "draft";
}
