"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import {
  ArrowRight,
  Bot,
  ClipboardList,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Sparkles,
  User,
} from "@/components/ui/icons";
import { getApiBaseUrl, isApiConfigured, setAccessToken } from "@/lib/api/client";
import { siteConfig } from "@/lib/site";

interface AuthFormProps {
  mode: "login" | "register";
}

const features = [
  {
    icon: <Sparkles className="size-5" />,
    title: "Подбор программ",
    text: "Рекомендации по вашим баллам и достижениям",
  },
  {
    icon: <ClipboardList className="size-5" />,
    title: "Заявления онлайн",
    text: "Ведите дерево заявок и следите за статусами",
  },
  {
    icon: <Bot className="size-5" />,
    title: "ИИ-помощник",
    text: "Ответит на вопросы об экзаменах и сроках",
  },
];

export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Заполните все обязательные поля.");
      return;
    }
    if (password.length < 8) {
      setError("Пароль должен содержать не менее 8 символов.");
      return;
    }
    if (!isLogin && password !== confirm) {
      setError("Пароли не совпадают.");
      return;
    }

    setLoading(true);
    try {
      if (isApiConfigured()) {
        if (!isLogin) {
          const registerRes = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              first_name: firstName || "Пользователь",
              last_name: lastName || "—",
              patronymic: patronymic || null,
              email,
              password,
            }),
          });
          if (!registerRes.ok) {
            const err = await registerRes.json().catch(() => null);
            throw new Error(err?.detail ?? "Ошибка регистрации");
          }
        }

        const loginBody = new URLSearchParams({ username: email, password });
        const loginRes = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: loginBody,
        });
        if (!loginRes.ok) {
          throw new Error("Неверный email или пароль");
        }
        const { access_token } = (await loginRes.json()) as { access_token: string };
        setAccessToken(access_token);
        window.localStorage.setItem("hse-session", JSON.stringify({ email, at: Date.now() }));
      } else {
        window.localStorage.setItem(
          "hse-session",
          JSON.stringify({ email, firstName, lastName, patronymic, at: Date.now() }),
        );
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  }

  function passwordField(
    value: string,
    setter: (value: string) => void,
    show: boolean,
    setShow: (update: boolean | ((prev: boolean) => boolean)) => void,
    id: string,
  ) {
    return (
      <div className="relative">
        <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => setter(event.target.value)}
          className="pr-11 pl-9"
          placeholder="••••••••"
          autoComplete={isLogin ? "current-password" : "new-password"}
        />
        <button
          type="button"
          onClick={() => setShow((value) => !value)}
          aria-label={show ? "Скрыть пароль" : "Показать пароль"}
          aria-pressed={show}
          className="hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-md p-1 text-zinc-400 transition-colors dark:text-zinc-500"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="border-border bg-surface shadow-brand-950/10 grid w-full max-w-4xl overflow-hidden rounded-3xl border shadow-xl lg:grid-cols-[0.85fr_1.15fr]">
      <aside className="from-brand-700 via-brand-800 to-brand-950 dark:from-brand-800 dark:via-brand-900 dark:to-brand-950 relative hidden flex-col justify-between gap-10 overflow-hidden bg-linear-to-br p-10 text-white lg:flex">
        <div
          aria-hidden
          className="from-brand-400/30 absolute -top-24 -right-24 size-64 rounded-full bg-gradient-to-br to-transparent blur-2xl"
        />
        <div
          aria-hidden
          className="from-exact-500/20 absolute -bottom-28 -left-20 size-64 rounded-full bg-gradient-to-tr to-transparent blur-2xl"
        />

        <div className="relative">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-white/20 to-white/5 ring-1 ring-white/20">
            <GraduationCap className="size-6" />
          </span>
          <p className="mt-6 text-3xl leading-tight font-bold tracking-tight">
            {isLogin ? "С возвращением!" : "Добро пожаловать"}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            {isLogin
              ? "Войдите в личный кабинет, чтобы продолжить подбор программ и отслеживать заявления."
              : "Создайте аккаунт — и мы соберём программы под ваши баллы, олимпиады и предпочтения."}
          </p>
        </div>

        <ul className="relative flex flex-col gap-4">
          {features.map((feature) => (
            <li key={feature.title} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex size-10 flex-none items-center justify-center rounded-xl bg-linear-to-br from-white/20 to-white/5 ring-1 ring-white/15">
                {feature.icon}
              </span>
              <div>
                <p className="text-sm font-semibold">{feature.title}</p>
                <p className="mt-0.5 text-xs text-white/60">{feature.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="relative text-xs text-white/50">
          {siteConfig.name} — агрегатор вузов и приёмных кампаний.
        </p>
      </aside>

      <div className="bg-surface z-10 flex flex-col justify-center p-8 sm:p-10">
        <Card className="shadow-none lg:hidden">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="from-brand-600 to-brand-800 inline-flex size-10 items-center justify-center rounded-xl bg-linear-to-br text-white">
              <GraduationCap className="size-5" />
            </span>
            <div>
              <p className="text-foreground text-sm font-semibold tracking-tight">
                {siteConfig.name}
              </p>
              <p className="text-muted text-xs">личный кабинет абитуриента</p>
            </div>
          </CardContent>
        </Card>

        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
          <p className="text-brand-600 dark:text-brand-400 text-xs font-semibold tracking-wide uppercase">
            {isLogin ? "Вход" : "Регистрация"}
          </p>
          <h1 className="text-heading mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">
            {isLogin ? "Войдите в кабинет" : "Создать аккаунт"}
          </h1>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {!isLogin ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Имя" htmlFor="first-name">
                  <div className="relative">
                    <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className="pl-9"
                      placeholder="Иван"
                      autoComplete="given-name"
                    />
                  </div>
                </Field>
                <Field label="Фамилия" htmlFor="last-name">
                  <div className="relative">
                    <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className="pl-9"
                      placeholder="Петров"
                      autoComplete="family-name"
                    />
                  </div>
                </Field>
              </div>
              <Field label="Отчество (необязательно)" htmlFor="patronymic">
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                  <Input
                    id="patronymic"
                    value={patronymic}
                    onChange={(event) => setPatronymic(event.target.value)}
                    className="pl-9"
                    placeholder="Иванович"
                    autoComplete="additional-name"
                  />
                </div>
              </Field>
            </>
          ) : null}

          <Field label="Email" htmlFor="email">
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-9"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </Field>

          <Field
            label="Пароль"
            htmlFor="password"
            hint={isLogin ? undefined : "Минимум 8 символов"}
          >
            {passwordField(password, setPassword, showPassword, setShowPassword, "password")}
          </Field>

          {!isLogin ? (
            <Field label="Подтвердите пароль" htmlFor="confirm-password">
              {passwordField(confirm, setConfirm, showConfirm, setShowConfirm, "confirm-password")}
            </Field>
          ) : null}

          <Button type="submit" size="lg" className="mt-1 w-full" disabled={loading}>
            {loading ? "Обработка…" : isLogin ? "Войти" : "Зарегистрироваться"}
            {!loading ? <ArrowRight className="size-4" /> : null}
          </Button>
        </form>

        <div className="border-border mt-6 border-t pt-5 text-sm">
          {isLogin ? (
            <p className="text-muted text-center">
              Нет аккаунта?{" "}
              <Link
                href="/register"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium transition-colors"
              >
                Зарегистрируйтесь
              </Link>
            </p>
          ) : (
            <p className="text-muted text-center">
              Уже есть аккаунт?{" "}
              <Link
                href="/login"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium transition-colors"
              >
                Войти
              </Link>
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 sm:hidden">
          <span className="text-muted text-xs">Куда вернуться?</span>
          <ButtonLink href="/" variant="secondary" size="sm">
            На главную
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
