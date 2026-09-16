import type { Metadata } from "next";

import { AdminStub } from "@/components/admin/admin-stub";

export const metadata: Metadata = {
  title: "Материалы — админ-панель",
};

export default function AdminMaterialsPage() {
  return (
    <AdminStub
      title="Материалы"
      description="Статьи, гайды и справочные материалы для абитуриентов."
      features={[
        "Публикация и редактирование статей раздела «Полезные материалы»",
        "Управление черновиками и статусами публикации",
        "Категории и теги для структурирования материалов",
        "Просмотр статистики прочтений по каждому материалу",
      ]}
    />
  );
}