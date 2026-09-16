import type { Metadata } from "next";

import { AdminUsers } from "@/components/admin/admin-users";

export const metadata: Metadata = {
  title: "Пользователи — админ-панель",
};

export default function AdminUsersPage() {
  return <AdminUsers />;
}
