import { getAllProgramsWithContext } from "@/data/universities";
import type { ProgramRecommendation, UserProfile } from "@/types";

const REASON_BY_FACULTY: Record<string, string> = {
  "hse-fcs": "Совпадает с олимпиадой по информатике",
  "msu-vmk": "Сильная математическая подготовка",
  "mipt-fpmi": "Подходит по профилю физико-математических достижений",
  "itmo-ait": "Высокий балл за хакатон и олимпиаду",
  "spbu-mathmech": "Соответствует профилю аттестата",
  "bmstu-iu": "Подходит по инженерному профилю",
  "hse-fes": "Дополнительно: интерес к аналитике данных",
};

/**
 * Простой скоринг для офлайн-режима (когда API не подключён).
 * Реальные рекомендации приходят с бэкенда.
 */
export function getRecommendations(profile: UserProfile, limit = 4): ProgramRecommendation[] {
  const hasDiploma = profile.diplomas.length > 0;
  const hasOlympiad = profile.achievements.some((item) => item.category === "Олимпиады");

  return getAllProgramsWithContext()
    .map((program) => {
      const reasons: string[] = [];
      let score = 55;

      const reason = REASON_BY_FACULTY[program.facultyId];
      if (reason) {
        reasons.push(reason);
        score += 20;
      }
      if (hasDiploma) {
        reasons.push("Есть документ об образовании");
        score += 10;
      }
      if (program.budgetPlaces > 100) {
        reasons.push("Много бюджетных мест");
        score += 5;
      }
      if (hasOlympiad) {
        reasons.push("Есть достижения в олимпиадах");
        score += 10;
      }

      return { program, score: Math.round(score), reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
