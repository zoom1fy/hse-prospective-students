import { HeroSearch } from "@/components/home/hero-search";
import { MaterialsGrid } from "@/components/home/materials-grid";
import { Steps } from "@/components/home/steps";
import { CalendarTimeline } from "@/components/home/calendar-timeline";
import { ProgramCard } from "@/components/programs/program-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { calendarEvents } from "@/data/calendar";
import { materials } from "@/data/materials";
import { getPopularPrograms } from "@/data/universities";

export default function HomePage() {
  const popularPrograms = getPopularPrograms(6);

  return (
    <>
      {/* SECTION 1: Hero */}
      <section className="border-border from-brand-50/50 via-brand-50/20 to-background dark:from-brand-950/40 dark:via-brand-950/10 relative border-b bg-linear-to-b py-8 sm:py-16">
        <Container>
          <div className="max-w-6xl text-left">
            {/* Заголовок */}
            <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-6xl">
              Найдите вуз и программу, которая подходит именно вам
            </h1>

            {/* Описание */}
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-600 sm:text-xl dark:text-zinc-300">
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
          <SectionHeading
            title="Популярные направления"
            description="Программы, которые чаще всего выбирают абитуриенты."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 3: Календарь абитуриента */}
      <Container className="py-14 sm:py-16">
        {/* Заголовок */}
        <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-6xl">
          Календарь абитуриента
        </h1>
        <CalendarTimeline events={calendarEvents} />
      </Container>

      {/* SECTION 4: Как поступить за 4 шага */}
      <section className="border-border bg-surface border-y">
        <Container className="py-14 sm:py-16">
          {/* Заголовок */}
          <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-6xl">
            Как поступить за 4 шага
          </h1>
          <Steps />
        </Container>
      </section>

      {/* SECTION 5: Полезные материалы */}
      <Container className="py-14 sm:py-16">
        <MaterialsGrid materials={materials} />
      </Container>
    </>
  );
}
