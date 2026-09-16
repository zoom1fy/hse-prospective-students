import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="bg-background relative min-h-svh overflow-hidden">
        <div className="relative z-10 flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
