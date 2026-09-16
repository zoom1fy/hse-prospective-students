"use client";

import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Pencil, Trash } from "@/components/ui/icons";
import { Modal } from "@/components/ui/modal";
import { deleteAdminUser, getAdminUsers, getRegions, updateAdminUser } from "@/lib/api/admin";
import type { ApiReference, ApiUser } from "@/lib/api/types";

import { ConfirmDialog } from "./confirm-dialog";

interface UserFormValues {
  first_name: string;
  last_name: string;
  patronymic: string;
  email: string;
  education: string;
  id_region: string;
  is_admin: boolean;
}

function toForm(user: ApiUser): UserFormValues {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    patronymic: user.patronymic ?? "",
    email: user.email,
    education: user.education ?? "",
    id_region: user.id_region != null ? String(user.id_region) : "",
    is_admin: user.is_admin,
  };
}

export function AdminUsers() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [regions, setRegions] = useState<ApiReference[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [adminOnly, setAdminOnly] = useState(false);
  const [editing, setEditing] = useState<ApiUser | null>(null);
  const [removing, setRemoving] = useState<ApiUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [loadedUsers, loadedRegions] = await Promise.all([getAdminUsers(), getRegions()]);
        if (cancelled) return;
        setUsers(loadedUsers);
        setRegions(loadedRegions);
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const filtered = users.filter((user) => {
    if (adminOnly && !user.is_admin) return false;
    const haystack =
      `${user.last_name} ${user.first_name} ${user.patronymic ?? ""} ${user.email}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div>
      <PageHeader
        eyebrow="Админ-панель"
        title="Пользователи"
        description="Профили абитуриентов, документы, права администратора и удаление аккаунтов."
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск по ФИО или email"
          className="max-w-xs"
        />
        <label className="text-foreground flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={adminOnly}
            onChange={(event) => setAdminOnly(event.target.checked)}
            className="size-4"
          />
          Только администраторы
        </label>
        <span className="text-muted ml-auto text-sm">Всего: {filtered.length}</span>
      </div>

      {state === "loading" ? (
        <div className="border-border bg-surface text-muted mt-6 rounded-xl border p-6 text-sm">
          Загрузка…
        </div>
      ) : null}

      {state === "error" ? (
        <div className="border-border text-muted mt-6 rounded-xl border border-dashed p-12 text-center text-sm">
          Не удалось загрузить пользователей.
        </div>
      ) : null}

      {state === "ready" ? (
        <Card className="mt-6">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-200 border-collapse text-sm">
                <thead>
                  <tr className="border-border text-muted border-b text-left">
                    <th className="px-4 py-3 font-medium">ФИО</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Регион</th>
                    <th className="px-4 py-3 font-medium">Дипломы</th>
                    <th className="px-4 py-3 font-medium">Достижения</th>
                    <th className="px-4 py-3 font-medium">Роль</th>
                    <th className="px-4 py-3 text-right font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user.id} className="border-border hover:bg-surface-muted/40 border-b">
                      <td className="px-4 py-3">
                        {user.last_name} {user.first_name}
                        {user.patronymic ? ` ${user.patronymic}` : ""}
                      </td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="text-muted px-4 py-3">
                        {regions.find((region) => region.id === user.id_region)?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">{user.diplomas.length}</td>
                      <td className="px-4 py-3">{user.achievements.length}</td>
                      <td className="px-4 py-3">
                        {user.is_admin ? (
                          <Badge>Администратор</Badge>
                        ) : (
                          <span className="text-muted">Абитуриент</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Редактировать"
                            onClick={() => setEditing(user)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Удалить"
                            onClick={() => setRemoving(user)}
                          >
                            <Trash className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {editing ? (
        <UserModal
          user={editing}
          regions={regions}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      ) : null}

      {removing ? (
        <ConfirmDialog
          title="Удалить пользователя?"
          description={`Аккаунт ${removing.email} и все связанные данные будут удалены безвозвратно.`}
          onClose={() => setRemoving(null)}
          onConfirm={async () => {
            await deleteAdminUser(removing.id);
            reload();
          }}
        />
      ) : null}
    </div>
  );
}

function UserModal({
  user,
  regions,
  onClose,
  onSaved,
}: {
  user: ApiUser;
  regions: ApiReference[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<UserFormValues>(() => toForm(user));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateAdminUser(user.id, {
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        patronymic: values.patronymic.trim() || null,
        email: values.email.trim(),
        education: values.education.trim() || null,
        id_region: values.id_region ? Number(values.id_region) : null,
        is_admin: values.is_admin,
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить");
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Редактирование пользователя" description={user.email}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Фамилия" htmlFor="admin-last">
            <Input
              id="admin-last"
              value={values.last_name}
              onChange={(event) => setValues({ ...values, last_name: event.target.value })}
            />
          </Field>
          <Field label="Имя" htmlFor="admin-first">
            <Input
              id="admin-first"
              value={values.first_name}
              onChange={(event) => setValues({ ...values, first_name: event.target.value })}
            />
          </Field>
          <Field label="Отчество" htmlFor="admin-middle">
            <Input
              id="admin-middle"
              value={values.patronymic}
              onChange={(event) => setValues({ ...values, patronymic: event.target.value })}
            />
          </Field>
          <Field label="Email" htmlFor="admin-email">
            <Input
              id="admin-email"
              type="email"
              value={values.email}
              onChange={(event) => setValues({ ...values, email: event.target.value })}
            />
          </Field>
          <Field label="Регион" htmlFor="admin-region">
            <Select
              id="admin-region"
              value={values.id_region}
              onChange={(event) => setValues({ ...values, id_region: event.target.value })}
            >
              <option value="">Не указан</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Дополнительное образование" htmlFor="admin-education">
          <Textarea
            id="admin-education"
            value={values.education}
            onChange={(event) => setValues({ ...values, education: event.target.value })}
          />
        </Field>

        <label className="text-foreground flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.is_admin}
            onChange={(event) => setValues({ ...values, is_admin: event.target.checked })}
            className="size-4"
          />
          Права администратора
        </label>

        {error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </p>
        ) : null}

        <div className="mt-1 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Отмена
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
