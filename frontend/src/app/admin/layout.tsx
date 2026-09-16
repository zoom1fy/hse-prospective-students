import { AdminNav } from "@/components/layout/admin-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="grid gap-8 py-8 lg:grid-cols-[220px_1fr] lg:py-12">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <AdminNav />
          </aside>
          <div className="min-w-0">{children}</div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}