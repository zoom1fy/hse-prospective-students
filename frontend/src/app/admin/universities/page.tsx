import type { Metadata } from "next";

import { AdminStub } from "@/components/admin/admin-stub";

export const metadata: Metadata = {
  title: "Университеты — админ-панель",
};

export default function AdminUniversitiesPage() {
  return (
    <AdminStub
      title="Университеты"
      description="Управление вузами, факультетами и их описаниями."
      features={[
        "Добавление и редактирование университетов: описание, сайт, контакты",
        "Управление факультетами внутри каждого вуза",
        "Контроль регионов и городов нахождения вузов",
        "Размещение официальных ссылок и материалов о вузе",
      ]}
    />
  );
}