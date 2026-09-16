import type { Metadata } from "next";

import { AdminUniversities } from "@/components/admin/admin-universities";

export const metadata: Metadata = {
  title: "Университеты — админ-панель",
};

export default function AdminUniversitiesPage() {
  return <AdminUniversities />;
}
