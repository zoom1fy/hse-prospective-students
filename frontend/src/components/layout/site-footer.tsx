import Link from "next/link";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-border bg-surface mt-auto border-t">
      <Container className="py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-muted text-xs">
            © {new Date().getFullYear()} {siteConfig.name}. Демонстрационный прототип.
          </div>

          <div className="sm:text-right">
            <Link href="/" className="hover:text-brand-600 font-semibold transition-colors">
              {siteConfig.name}
            </Link>
            <p className="text-muted mt-3 max-w-sm text-sm sm:ml-auto">{siteConfig.description}</p>
            <Link
              href="/admin"
              className="text-muted hover:text-brand-600 mt-4 inline-block text-xs transition-colors"
            >
              Админ-панель
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
