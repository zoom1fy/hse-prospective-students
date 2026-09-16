import type { Metadata } from "next";

import { AdminPrograms } from "@/components/admin/admin-programs";

export const metadata: Metadata = {
  title: "Программы — админ-панель",
};

export default function AdminProgramsPage() {
  return <AdminPrograms />;
}
