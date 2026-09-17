import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";
import { getCatalog, getUniversities } from "@/lib/api";
import { UniversitySwiper } from "@/components/swiper/university-swiper";
import { SectionHeading } from "@/components/ui/section-heading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Свайпер",
  description:
    "Swipe-режим: перелистывайте случайные вузы, выбирайте понравившиеся и сохраняйте избранное.",
};

export default async function SwiperPage() {
  const [universities, catalog] = await Promise.all([getUniversities(), getCatalog()]);

  const programsByUniversity: Record<string, string[]> = {};
  for (const program of catalog.programs) {
    const list = programsByUniversity[program.university.id] ?? [];
    if (!list.includes(program.name)) list.push(program.name);
    programsByUniversity[program.university.id] = list;
  }

  return (
    <Container className="py-8 sm:py-12">
      <SectionHeading title="Свайпер" />

      <UniversitySwiper universities={universities} programsByUniversity={programsByUniversity} />
    </Container>
  );
}
