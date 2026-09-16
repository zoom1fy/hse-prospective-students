import type { Metadata } from "next";

import { AdminStatements } from "@/components/admin/admin-statements";

export const metadata: Metadata = {
  title: "Заявки — админ-панель",
};

export default function AdminStatementsPage() {
  return <AdminStatements />;
}
