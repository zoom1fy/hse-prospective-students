import type { Metadata } from "next";

import { ProfileForm } from "@/components/dashboard/profile-form";
import { PageHeader } from "@/components/layout/page-header";
import { currentUserProfile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Личные данные",
};

export default function DashboardProfilePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Личный кабинет"
        title="Личные данные и документы"
        description="Заполните ФИО, паспорт, СНИЛС, дипломы, достижения и другое образование — данные используются для подбора программ."
      />
      <div className="mt-8">
        <ProfileForm profile={currentUserProfile} />
      </div>
    </div>
  );
}
