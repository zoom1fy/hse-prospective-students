import type { Metadata } from "next";

import { RecommendationsContent } from "@/components/dashboard/recommendations-content";

export const metadata: Metadata = {
  title: "Подбор программ",
};

export default function RecommendationsPage() {
  return <RecommendationsContent />;
}
