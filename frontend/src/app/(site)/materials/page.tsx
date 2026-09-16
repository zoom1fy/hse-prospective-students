import type { Metadata } from "next";

import { MaterialsGrid } from "@/components/home/materials-grid";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";
import { materials } from "@/data/materials";

export const metadata: Metadata = {
  title: "Полезные материалы",
  description:
    "Гайды для абитуриентов: как выбрать направление, не пропустить приёмную кампанию, подготовиться к ЕГЭ и олимпиадам, получить стипендию.",
};

export default function MaterialsPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[{ label: "Главная", href: "/" }, { label: "Полезные материалы" }]}
      />

      <PageHeader
        className="mt-4"
        eyebrow="База знаний"
        title="Полезные материалы"
        description="Разбираемся в поступлении по шагам: от выбора направления до стипендий и первых дней в вузе."
      />

      <MaterialsGrid materials={materials} className="mt-8" />
    </Container>
  );
}