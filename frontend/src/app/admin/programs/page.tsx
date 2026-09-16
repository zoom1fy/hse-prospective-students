import type { Metadata } from "next";

import { AdminStub } from "@/components/admin/admin-stub";

export const metadata: Metadata = {
  title: "Программы — админ-панель",
};

export default function AdminProgramsPage() {
  return (
    <AdminStub
      title="Программы"
      description="Направления подготовки, места, стоимость и вступительные испытания."
      features={[
        "Создание и редактирование программ в разрезе факультетов",
        "Настройка бюджетных и платных мест, стоимости обучения",
        "Список вступительных испытаний и проходные баллы по каждому предмету",
        "Контроль сроков приёма документов и открытых наборов",
      ]}
    />
  );
}