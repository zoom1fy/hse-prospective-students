import type { Metadata } from "next";

import { ProfileForm } from "@/components/dashboard/profile-form";
import { ProfileSidebar } from "@/components/dashboard/profile-sidebar";
import { currentUserProfile } from "@/data/profile";

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
        <p className="mt-2 text-sm text-muted sm:text-base">
          Заполните ФИО, паспорт, СНИЛС, дипломы и достижения — данные используются для
          подбора программ.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_300px] xl:items-start">
        <ProfileForm profile={currentUserProfile} />
        <div className="xl:sticky xl:top-24">
          <ProfileSidebar profile={currentUserProfile} />
        </div>
      </div>
    </div>
  );
}