import type { Metadata } from "next";

import { AdminStub } from "@/components/admin/admin-stub";

export const metadata: Metadata = {
  title: "Пользователи — админ-панель",
};

export default function AdminUsersPage() {
  return (
    <AdminStub
      title="Пользователи"
      description="Список абитуриентов, их профили, документы и статусы заявок."
      features={[
        "Список зарегистрированных пользователей с фильтрами по региону и статусу заявок",
        "Просмотр и редактирование профиля, документов об образовании и достижений",
        "Управление заявлениями: приём, отклонение, перевод между статусами",
        "Блокировка и восстановление доступа к личному кабинету",
      ]}
    />
  );
}