import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";
import { getUniversities } from "@/lib/api";
import { UniversitySwiper } from "@/components/swiper/university-swiper";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Свайпер",
  description:
    "Swipe-режим: перелистывайте случайные вузы, выбирайте понравившиеся и сохраняйте избранное.",
};

export default async function SwiperPage() {
  const universities = await getUniversities();

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Свайпер" }]} />

      <PageHeader
        className="mt-4"
        eyebrow="Свайпер"
        title="Выберите вуз"
        description="Листайте вузы в стиле Tinder — смахните вправо, если понравился, влево — если нет."
      />

      <UniversitySwiper universities={universities} />
    </Container>
  );
}
