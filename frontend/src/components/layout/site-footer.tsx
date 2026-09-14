import Link from "next/link";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-border bg-surface mt-auto border-t">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="bg-brand-600 flex size-8 items-center justify-center rounded-lg text-xs font-bold text-white">
              {siteConfig.shortName}
            </span>
            <span className="font-semibold">{siteConfig.name}</span>
          </div>
          <p className="mt-3 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Абитуриентам</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li>
              <Link href="/universities" className="hover:text-foreground">
                Все вузы
              </Link>
            </li>
            <li>
              <Link href="/universities?budgetOnly=true" className="hover:text-foreground">
                Бюджетные места
              </Link>
            </li>
            <li>
              <Link href="/dashboard/recommendations" className="hover:text-foreground">
                Подбор программ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Личный кабинет</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li>
              <Link href="/dashboard" className="hover:text-foreground">
                Профиль
              </Link>
            </li>
            <li>
              <Link href="/dashboard/profile" className="hover:text-foreground">
                Мои документы
              </Link>
            </li>
            <li>
              <Link href="/dashboard/applications" className="hover:text-foreground">
                Дерево заявок
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-border border-t">
        <Container className="flex flex-col gap-2 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Демонстрационный прототип.
          </p>
          <p>Данные вузов и программ приведены для примера.</p>
        </Container>
      </div>
    </footer>
  );
}
