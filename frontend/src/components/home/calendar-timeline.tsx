import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import type { CalendarEvent } from "@/data/calendar";

const dotStyles: Record<CalendarEvent["status"], string> = {
  completed: "bg-emerald-500",
  active: "bg-brand-600 ring-brand-200 dark:ring-brand-800 ring-4",
  upcoming: "bg-zinc-300 dark:bg-zinc-600",
};

const badgeVariants: Record<CalendarEvent["status"], "success" | "default" | "neutral"> = {
  completed: "success",
  active: "default",
  upcoming: "neutral",
};

const badgeLabels: Record<CalendarEvent["status"], string> = {
  completed: "Завершено",
  active: "Идёт приём",
  upcoming: "Скоро",
};

interface CalendarTimelineProps {
  events: CalendarEvent[];
}

export function CalendarTimeline({ events }: CalendarTimelineProps) {
  return (
    <div>
      <SectionHeading
        title="Календарь абитуриента"
        description="Ключевые даты приёмной кампании ВШЭ 2027 года."
      />
      <div className="relative mt-8 ml-4">
        <div className="border-border absolute top-2 bottom-2 left-0 w-px" />
        <div className="flex flex-col gap-8">
          {events.map((event) => (
            <div key={event.id} className="relative flex gap-6">
              <div className="relative z-10 flex shrink-0 items-start pt-1">
                <div className={`size-3 rounded-full ${dotStyles[event.status]}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{event.date}</p>
                  <Badge variant={badgeVariants[event.status]}>
                    {badgeLabels[event.status]}
                  </Badge>
                </div>
                <h3 className="mt-1 font-semibold tracking-tight">{event.title}</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
