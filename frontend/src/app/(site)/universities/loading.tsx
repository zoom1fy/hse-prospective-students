import { Container } from "@/components/ui/container";

export default function UniversitiesLoading() {
  return (
    <Container className="py-8 sm:py-12">
      <div className="bg-surface-muted h-4 w-48 animate-pulse rounded" />
      <div className="bg-surface-muted mt-6 h-9 w-80 animate-pulse rounded" />
      <div className="bg-surface-muted mt-8 h-40 w-full animate-pulse rounded-2xl" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-surface-muted h-64 animate-pulse rounded-2xl" />
        ))}
      </div>
    </Container>
  );
}
