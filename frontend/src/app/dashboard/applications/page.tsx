import type { Metadata } from "next";

import { ApplicationsContent } from "@/components/dashboard/applications-content";

export const metadata: Metadata = {
  title: "Дерево заявок",
};

export default function ApplicationsPage() {
  return <ApplicationsContent />;
}
