import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { UserProfile } from "@/types";

function getCompleteness(profile: UserProfile) {
  const checks = [
    Boolean(profile.fullName.last && profile.fullName.first),
    Boolean(profile.passport.number),
    Boolean(profile.snils),
    profile.diplomas.length > 0,
    profile.achievements.length > 0,
    profile.education.length > 0,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

function pluralDiplomas(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) return "диплом";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "диплома";
  return "дипломов";
}

export function ProfileSidebar({ profile }: { profile: UserProfile }) {
  const completeness = getCompleteness(profile);
  const initials = `${profile.fullName.first.charAt(0)}${profile.fullName.last.charAt(0)}`;

  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="from-brand-600 to-brand-700 shadow-brand-500/20 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-bold text-white shadow-lg">
          {initials}
        </div>
        <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
          {profile.fullName.last} {profile.fullName.first} {profile.fullName.middle}
        </h2>
        <p className="mt-1 text-sm text-muted">{profile.email}</p>
        <p className="text-sm text-muted">{profile.phone}</p>

        <div className="mt-6 w-full border-t border-border pt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Полнота профиля</span>
            <span className="font-semibold">{completeness}%</span>
          </div>
          <Progress className="mt-2" value={completeness} />
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Заполните профиль для точного подбора программ и расчёта шансов на поступление.
          </p>
        </div>

        {(profile.diplomas.length > 0 || profile.achievements.length > 0) ? (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {profile.diplomas.length > 0 ? (
              <Badge>
                {profile.diplomas.length} {pluralDiplomas(profile.diplomas.length)}
              </Badge>
            ) : null}
            {profile.achievements.length > 0 ? (
              <Badge variant="success">{profile.achievements.length} достижений</Badge>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
