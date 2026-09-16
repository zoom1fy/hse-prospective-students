import type { Metadata } from "next";

import { AdminMaterials } from "@/components/admin/admin-materials";

export const metadata: Metadata = {
  title: "Материалы — админ-панель",
};

export default function AdminMaterialsPage() {
  return <AdminMaterials />;
}
