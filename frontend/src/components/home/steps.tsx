import { SectionHeading } from "@/components/ui/section-heading";
import { ClipboardList, FileText, Search, Check } from "@/components/ui/icons";

const steps = [
  {
    number: 1,
    title: "Выберите направление",
    description:
      "Изучите программы, сравните вузы и найдите то, что подходит именно вам.",
    Icon: Search,
  },
  {
    number: 2,
    title: "Подготовьте документы",
    description:
      "Соберите пакет документов: паспорт, СНИЛС, аттестат и результаты ЕГЭ.",
    Icon: FileText,
  },
  {
    number: 3,
    title: "Подайте заявление",
    description:
      "Заполните онлайн-заявку в личном кабинете или подайте документы лично в приёмной комиссии.",
    Icon: ClipboardList,
  },
  {
    number: 4,
    title: "Зачисление",
    description:
      "Отслеживайте статус заявления и получите приглашение на обучение.",
    Icon: Check,
  },
];

export function Steps() {
  return (
    <div>
      <SectionHeading
        title="Как поступить за 4 шага"
        description="Простой путь от выбора направления до зачисления."
      />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="border-border bg-background rounded-2xl border p-6"
          >
            <div className="bg-brand-600 flex size-10 items-center justify-center rounded-full text-sm font-bold text-white">
              {step.number}
            </div>
            <step.Icon className="text-brand-600 mt-4 size-6" />
            <h3 className="mt-3 font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
