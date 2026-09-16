import Link from "next/link";

import { GraduationCap } from "@/components/ui/icons";
import { siteConfig } from "@/lib/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background relative min-h-svh overflow-hidden">
      <div
        aria-hidden
        className="from-brand-50 via-brand-50/30 to-background dark:from-brand-950/40 dark:via-brand-950/15 dark:to-background absolute inset-0 bg-linear-to-b"
      />
      <div
        aria-hidden
        className="from-brand-500/20 to-exact-600/20 absolute -top-40 -right-40 size-130 rounded-full bg-gradient-to-br blur-3xl"
      />
      <div
        aria-hidden
        className="from-brand-500/20 to-exact-600/20 absolute -bottom-40 -left-40 size-130 rounded-full bg-gradient-to-br blur-3xl"
      />

      <header className="relative z-10 mx-auto flex h-20 w-full max-w-6xl items-center px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={siteConfig.name}
          className="inline-flex cursor-pointer items-center gap-2.5"
        >
          <span className="from-brand-600 to-brand-800 inline-flex size-10 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-lg shadow-brand-600/25">
            <GraduationCap className="size-5" />
          </span>
          <span className="text-heading text-2xl font-bold tracking-tight">{siteConfig.name}</span>
        </Link>
      </header>

      <div className="relative z-10 flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        {children}
      </div>
    </main>
  );
}