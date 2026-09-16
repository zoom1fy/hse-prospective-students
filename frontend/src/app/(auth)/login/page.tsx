import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Вход",
  description: "Войдите в личный кабинет абитуриента «Я.Абитуриент».",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
