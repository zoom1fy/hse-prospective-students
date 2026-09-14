import Link from "next/link";

import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  BookOpen,
  FileText,
  GraduationCap,
  Wallet,
} from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Material } from "@/data/materials";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  FileText,
  Award,
  Wallet,
  GraduationCap,
};

interface MaterialsGridProps {
  materials: Material[];
}

export function MaterialsGrid({ materials }: MaterialsGridProps) {
  return (
    <div>
      <SectionHeading
        title="Полезные материалы"
        description="Статьи, гайды и полезные ссылки для поступающих."
      />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => {
          const Icon = iconMap[material.icon] ?? FileText;
          return (
            <Link key={material.id} href={material.href} className="group block">
              <Card className="flex h-full flex-col p-6 transition-colors group-hover:border-brand-300 dark:group-hover:border-brand-700">
                <Icon className="text-brand-600 size-6 shrink-0" />
                <h3 className="mt-4 font-semibold tracking-tight">{material.title}</h3>
                <p className="mt-2 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {material.description}
                </p>
                <span className="text-brand-600 dark:text-brand-400 mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                  Подробнее
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
