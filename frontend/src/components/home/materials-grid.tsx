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
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => {
          const Icon = iconMap[material.icon] ?? FileText;
          return (
            <Link key={material.id} href={material.href} className="group block">
              <Card className="group-hover:border-brand-300 dark:group-hover:border-brand-700 flex h-full flex-col p-7 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md sm:p-8">
                {/* Иконка + заголовок в одной строке */}
                <div className="flex items-center gap-3">
                  <Icon className="text-brand-600 size-7 shrink-0" />
                  <h3 className="text-lg font-semibold tracking-tight">{material.title}</h3>
                </div>

                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted">
                  {material.description}
                </p>

                <span className="text-brand-600 dark:text-brand-400 mt-6 inline-flex items-center gap-1.5 text-sm font-medium">
                  Подробнее
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
