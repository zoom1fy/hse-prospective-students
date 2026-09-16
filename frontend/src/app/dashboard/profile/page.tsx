import type { Metadata } from "next";

import { ProfileContent } from "@/components/dashboard/profile-content";

export const metadata: Metadata = {
  title: "Личные данные",
};

export default function DashboardProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Личные данные
        </h1>
        <p className="text-muted mt-2 text-sm sm:text-base">
          Заполните ФИО, контакты, документы об образовании и достижения — данные используются для
          подбора программ.
        </p>
      </div>

      <ProfileContent />
    </div>
  );
}
