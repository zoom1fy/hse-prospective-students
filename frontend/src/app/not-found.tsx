import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRight, Search } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-brand-600 dark:text-brand-400 text-sm font-semibold">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Страница не найдена</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        Возможно, программа была переименована или ссылка устарела. Попробуйте найти её через
        каталог.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/universities" className={buttonVariants()}>
          <Search className="size-4" />
          Перейти в каталог
        </Link>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          На главную
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </Container>
  );
}
