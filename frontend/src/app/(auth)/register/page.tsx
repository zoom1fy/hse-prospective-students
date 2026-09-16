import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Регистрация",
  description: "Создайте аккаунт абитуриента на платформе «Я.Абитуриент».",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}