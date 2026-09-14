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
 * Very simple recommendation scoring used by the skeleton.
 * The real implementation will live on the backend and account for
 * exam results, olympiad benefits and preferences.
 */
export function getRecommendations(profile: UserProfile, limit = 4): ProgramRecommendation[] {
  const achievementPoints = profile.achievements.reduce((sum, item) => sum + item.points, 0);
  const averageScore = profile.diplomas.reduce((sum, item) => sum + item.averageScore, 0);

  return getAllProgramsWithContext()
    .map((program) => {
      const reasons: string[] = [];
      let score = 50 + Math.min(achievementPoints / 5, 25) + averageScore;

      const reason = REASON_BY_FACULTY[program.facultyId];
      if (reason) {
        reasons.push(reason);
        score += 15;
      }
      if (program.budgetPlaces > 100) {
        reasons.push("Много бюджетных мест");
        score += 5;
      }
      if (profile.achievements.some((item) => item.level === "national")) {
        reasons.push("Есть диплом Всероссийской олимпиады (БВИ)");
        score += 10;
      }

      return { program, score: Math.round(score), reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
