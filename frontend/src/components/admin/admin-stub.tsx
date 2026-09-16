import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Check } from "@/components/ui/icons";

interface AdminStubProps {
  title: string;
  description: string;
  features: string[];
}

export function AdminStub({ title, description, features }: AdminStubProps) {
  return (
    <div>
      <PageHeader eyebrow="Админ-панель" title={title} description={description} />

      <div className="mt-8">
        <EmptyState
          title="Раздел в разработке"
          description="Интерфейс и API для этого раздела появятся позже. Структура уже определена."
          action={<ButtonLink href="/admin" variant="secondary">Вернуться к обзору</ButtonLink>}
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Что появится в разделе</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5">
          {features.map((feature) => (
            <p key={feature} className="text-foreground flex items-center gap-2.5 text-sm">
              <Check className="text-brand-600 size-4 shrink-0" />
              {feature}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}