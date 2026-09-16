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
import type { Material } from "@/data/materials";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  FileText,
  Award,
  Wallet,
  GraduationCap,
};

interface MaterialsGridProps {
  materials: Material[];
  className?: string;
}

export function MaterialsGrid({ materials, className }: MaterialsGridProps) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {materials.map((material) => {
        const Icon = iconMap[material.icon] ?? FileText;
        return (
          <Link key={material.id} href={material.href} className="group block">
            <Card className="group-hover:border-brand-300 dark:group-hover:border-brand-700 flex h-full flex-col p-7 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md sm:p-8">
              <div className="flex items-center gap-3">
                <Icon className="text-brand-600 size-7 shrink-0" />
                <h3 className="text-lg font-semibold tracking-tight">{material.title}</h3>
              </div>

              <p className="text-muted mt-4 flex-1 text-[15px] leading-relaxed">
                {material.description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-muted text-xs">{material.readTime}</span>
                <span className="text-brand-600 dark:text-brand-400 inline-flex items-center gap-1.5 text-sm font-medium">
                  Подробнее
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
