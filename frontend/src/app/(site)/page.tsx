import { HeroSearch } from "@/components/home/hero-search";
import { MaterialsGrid } from "@/components/home/materials-grid";
import { PopularProgramsCarousel } from "@/components/home/popular-programs";
import { Steps } from "@/components/home/steps";
import { CalendarTimeline } from "@/components/home/calendar-timeline";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRight } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { calendarEvents } from "@/data/calendar";
import { materials } from "@/data/materials";
import { getPopularPrograms } from "@/lib/api";

export default async function HomePage() {
  const popularPrograms = await getPopularPrograms(6);

  return (
    <>
      {/* SECTION 1: Hero */}
      <section className="border-border from-brand-50/50 via-brand-50/20 to-background dark:from-brand-950/40 dark:via-brand-950/10 relative border-b bg-linear-to-b py-8 sm:py-16">
        <Container>
          <div className="max-w-6xl text-left">
            <SectionHeading title="Найдите вуз и программу, которая подходит именно вам" />

            {/* Описание */}
            <p className="text-foreground mt-6 max-w-3xl text-lg leading-relaxed sm:text-xl">
              Ведущие университеты, популярные направления, открытые наборы и личный кабинет с
              подбором программ по вашим данным — в одном месте.
            </p>

            {/* Блок поиска на всю ширину блока */}
            <div className="mt-10 w-full">
              <HeroSearch />
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 2: Популярные направления */}
      <section className="border-border bg-surface border-y">
        <Container className="py-14 sm:py-16">
          <SectionHeading title="Популярные направления" />
          <div className="mt-8">
            <PopularProgramsCarousel programs={popularPrograms} />
          </div>
        </Container>
      </section>

      {/* SECTION 3: Календарь абитуриента */}
      <Container className="py-14 sm:py-16">
        <SectionHeading title="Календарь абитуриента" />
        <CalendarTimeline events={calendarEvents} />
      </Container>

      {/* SECTION 4: Как поступить за 4 шага */}
      <section className="border-border bg-surface border-y">
        <Container className="py-14 sm:py-16">
          <SectionHeading title="Как поступить за 4 шага" />
          <Steps />
        </Container>
      </section>

      {/* SECTION 5: Полезные материалы */}
      <Container className="py-14 sm:py-16">
        <SectionHeading
          title="Полезные материалы"
          action={
            <ButtonLink href="/materials" variant="secondary">
              Все материалы
              <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />
        <MaterialsGrid materials={materials} className="mt-8" />
      </Container>
    </>
  );
}
