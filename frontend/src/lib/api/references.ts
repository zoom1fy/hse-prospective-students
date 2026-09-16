import type { ApplicationStatus, Degree, StudyForm } from "@/types";

export const regionNames: Record<number, string> = {
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

export const educationLevelNames: Record<number, string> = {
  1: "Бакалавриат",
  2: "Специалитет",
  3: "Магистратура",
  4: "Аспирантура",
};

export const studyTypeNames: Record<number, string> = {
  1: "Очная",
  2: "Очно-заочная",
  3: "Заочная",
};

export const statementStatusNames: Record<number, string> = {
  1: "Черновик",
  2: "Отправлено",
  3: "На рассмотрении",
  4: "Приглашение на экзамен",
  5: "Зачислен",
  6: "Отклонено",
  7: "Отозвано",
};

export const degreeByEducationLevel: Record<number, Degree> = {
  1: "bachelor",
  2: "specialist",
  3: "master",
  4: "postgraduate",
};

export const formByStudyType: Record<number, StudyForm> = {
  1: "full-time",
  2: "evening",
  3: "part-time",
};

export const statusByStatementName: Record<string, ApplicationStatus> = {
  Черновик: "draft",
  Отправлено: "submitted",
  "На рассмотрении": "under-review",
  "Приглашение на экзамен": "invited",
  Зачислен: "enrolled",
  Отклонено: "rejected",
  Отозвано: "rejected",
};

export const statusByStatementId: Record<number, ApplicationStatus> = {
  1: "draft",
  2: "submitted",
  3: "under-review",
  4: "invited",
  5: "enrolled",
  6: "rejected",
  7: "rejected",
};

export function regionName(id: number): string {
  return regionNames[id] ?? "—";
}

export function educationLevelName(id: number): string {
  return educationLevelNames[id] ?? `Уровень ${id}`;
}

export function studyTypeName(id: number): string {
  return studyTypeNames[id] ?? `Форма ${id}`;
}

export function statementStatusName(id: number): string {
  return statementStatusNames[id] ?? `Статус ${id}`;
}

export function toDegree(id: number | null | undefined): Degree {
  return (id != null && degreeByEducationLevel[id]) || "bachelor";
}

export function toStudyForm(id: number | null | undefined): StudyForm {
  return (id != null && formByStudyType[id]) || "full-time";
}

export function toApplicationStatus(id: number | null | undefined): ApplicationStatus {
  return (id != null && statusByStatementId[id]) || "draft";
}

export function toApplicationStatusByName(name: string): ApplicationStatus {
  return statusByStatementName[name] ?? "draft";
}