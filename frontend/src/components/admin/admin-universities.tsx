"use client";

import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Pencil, Plus, Trash } from "@/components/ui/icons";
import { Modal } from "@/components/ui/modal";
import {
  createFaculty,
  createUniversity,
  deleteFaculty,
  deleteUniversity,
  getFaculties,
  getRegions,
  getUniversities,
  updateFaculty,
  updateUniversity,
} from "@/lib/api/admin";
import type {
  ApiFaculty,
  ApiFacultyInput,
  ApiReference,
  ApiUniversity,
  ApiUniversityInput,
} from "@/lib/api/types";

import { ConfirmDialog } from "./confirm-dialog";

type Confirm =
  | { kind: "university"; item: ApiUniversity }
  | { kind: "faculty"; item: ApiFaculty };

export function AdminUniversities() {
  const [universities, setUniversities] = useState<ApiUniversity[]>([]);
  const [faculties, setFaculties] = useState<ApiFaculty[]>([]);
  const [regions, setRegions] = useState<ApiReference[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [editingUniversity, setEditingUniversity] = useState<ApiUniversity | "new" | null>(null);
  const [facultyModal, setFacultyModal] = useState<
    { universityId: number; faculty: ApiFaculty | null } | null
  >(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [loadedUniversities, loadedFaculties, loadedRegions] = await Promise.all([
          getUniversities(),
          getFaculties(),
          getRegions(),
        ]);
        if (cancelled) return;
        setUniversities(loadedUniversities);
        setFaculties(loadedFaculties);
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

  async function runAction(action: () => Promise<void>) {
    setError("");
    try {
      await action();
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Операция не удалась");
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Админ-панель"
        title="Университеты и факультеты"
        description="Добавляйте вузы, редактируйте их данные и управляйте факультетами."
        actions={
          <Button onClick={() => setEditingUniversity("new")}>
            <Plus className="size-4" />
            Добавить вуз
          </Button>
        }
      />

      {error ? (
        <p className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      ) : null}

      {state === "loading" ? (
        <div className="border-border bg-surface text-muted mt-6 rounded-xl border p-6 text-sm">
          Загрузка…
        </div>
      ) : null}

      {state === "error" ? (
        <div className="border-border text-muted mt-6 rounded-xl border border-dashed p-12 text-center text-sm">
          Не удалось загрузить данные.
        </div>
      ) : null}

      {state === "ready" ? (
        <div className="mt-6 flex flex-col gap-5">
          {universities.length === 0 ? (
            <div className="border-border text-muted rounded-xl border border-dashed p-12 text-center text-sm">
              Вузов пока нет. Добавьте первый.
            </div>
          ) : null}

          {universities.map((university) => {
            const universityFaculties = faculties.filter(
              (faculty) => faculty.id_university === university.id,
            );
            return (
              <Card key={university.id}>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold tracking-tight">{university.name}</h3>
                        {university.short_name ? (
                          <Badge variant="neutral">{university.short_name}</Badge>
                        ) : null}
                        <Badge>
                          {regions.find((region) => region.id === university.id_region)?.name ??
                            "Регион не указан"}
                        </Badge>
                      </div>
                      {university.description ? (
                        <p className="text-muted mt-2 max-w-3xl text-sm">
                          {university.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          setFacultyModal({ universityId: university.id, faculty: null })
                        }
                      >
                        <Plus className="size-4" />
                        Факультет
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Редактировать вуз"
                        onClick={() => setEditingUniversity(university)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Удалить вуз"
                        onClick={() => setConfirm({ kind: "university", item: university })}
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="border-border mt-5 border-t pt-4">
                    <p className="text-muted text-xs font-semibold tracking-wide uppercase">
                      Факультеты ({universityFaculties.length})
                    </p>
                    {universityFaculties.length === 0 ? (
                      <p className="text-muted mt-2 text-sm">Факультетов пока нет.</p>
                    ) : (
                      <ul className="mt-3 flex flex-col gap-2">
                        {universityFaculties.map((faculty) => (
                          <li
                            key={faculty.id}
                            className="border-border bg-surface-muted/40 flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{faculty.name}</p>
                              {faculty.short_name ? (
                                <p className="text-muted text-xs">{faculty.short_name}</p>
                              ) : null}
                            </div>
                            <div className="flex shrink-0 gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Редактировать факультет"
                                onClick={() =>
                                  setFacultyModal({ universityId: university.id, faculty })
                                }
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Удалить факультет"
                                onClick={() => setConfirm({ kind: "faculty", item: faculty })}
                              >
                                <Trash className="size-4" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : null}

      {editingUniversity ? (
        <UniversityModal
          university={editingUniversity === "new" ? null : editingUniversity}
          regions={regions}
          onClose={() => setEditingUniversity(null)}
          onSaved={() => {
            setEditingUniversity(null);
            reload();
          }}
        />
      ) : null}

      {facultyModal ? (
        <FacultyModal
          universityId={facultyModal.universityId}
          faculty={facultyModal.faculty}
          universities={universities}
          onClose={() => setFacultyModal(null)}
          onSaved={() => {
            setFacultyModal(null);
            reload();
          }}
        />
      ) : null}

      {confirm ? (
        <ConfirmDialog
          title={confirm.kind === "university" ? "Удалить вуз?" : "Удалить факультет?"}
          description={
            confirm.kind === "university"
              ? "Вместе с вузом удалятся его факультеты и программы (если на них нет заявок)."
              : "Факультет и его программы будут удалены (если на них нет заявок)."
          }
          onClose={() => setConfirm(null)}
          onConfirm={() =>
            runAction(async () => {
              if (confirm.kind === "university") await deleteUniversity(confirm.item.id);
              else await deleteFaculty(confirm.item.id);
            })
          }
        />
      ) : null}
    </div>
  );
}

function UniversityModal({
  university,
  regions,
  onClose,
  onSaved,
}: {
  university: ApiUniversity | null;
  regions: ApiReference[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<ApiUniversityInput>(() => ({
    name: university?.name ?? "",
    short_name: university?.short_name ?? "",
    email: university?.email ?? "",
    official_url: university?.official_url ?? "",
    logo: university?.logo ?? "",
    description: university?.description ?? "",
    id_region: university?.id_region ?? regions[0]?.id ?? 1,
  }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.name.trim()) {
      setError("Укажите название вуза.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (university) await updateUniversity(university.id, values);
      else await createUniversity(values);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить");
      setSaving(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={university ? "Редактирование вуза" : "Новый вуз"}
      className="sm:max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Название" htmlFor="uni-name">
          <Input
            id="uni-name"
            value={values.name}
            onChange={(event) => setValues({ ...values, name: event.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Сокращённое название" htmlFor="uni-short">
            <Input
              id="uni-short"
              value={values.short_name ?? ""}
              onChange={(event) => setValues({ ...values, short_name: event.target.value })}
            />
          </Field>
          <Field label="Регион" htmlFor="uni-region">
            <Select
              id="uni-region"
              value={String(values.id_region)}
              onChange={(event) => setValues({ ...values, id_region: Number(event.target.value) })}
            >
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Email" htmlFor="uni-email">
            <Input
              id="uni-email"
              type="email"
              value={values.email ?? ""}
              onChange={(event) => setValues({ ...values, email: event.target.value })}
            />
          </Field>
          <Field label="Сайт" htmlFor="uni-url">
            <Input
              id="uni-url"
              value={values.official_url ?? ""}
              onChange={(event) => setValues({ ...values, official_url: event.target.value })}
            />
          </Field>
        </div>
        <Field label="Логотип (URL)" htmlFor="uni-logo">
          <Input
            id="uni-logo"
            value={values.logo ?? ""}
            onChange={(event) => setValues({ ...values, logo: event.target.value })}
          />
        </Field>
        <Field label="Описание" htmlFor="uni-description">
          <Textarea
            id="uni-description"
            value={values.description ?? ""}
            onChange={(event) => setValues({ ...values, description: event.target.value })}
          />
        </Field>

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

function FacultyModal({
  universityId,
  faculty,
  universities,
  onClose,
  onSaved,
}: {
  universityId: number;
  faculty: ApiFaculty | null;
  universities: ApiUniversity[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<ApiFacultyInput>(() => ({
    name: faculty?.name ?? "",
    short_name: faculty?.short_name ?? "",
    official_url: faculty?.official_url ?? "",
    id_university: faculty?.id_university ?? universityId,
  }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.name.trim()) {
      setError("Укажите название факультета.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (faculty) await updateFaculty(faculty.id, values);
      else await createFaculty(values);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить");
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={faculty ? "Редактирование факультета" : "Новый факультет"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Название" htmlFor="fac-name">
          <Input
            id="fac-name"
            value={values.name}
            onChange={(event) => setValues({ ...values, name: event.target.value })}
          />
        </Field>
        <Field label="Сокращённое название" htmlFor="fac-short">
          <Input
            id="fac-short"
            value={values.short_name ?? ""}
            onChange={(event) => setValues({ ...values, short_name: event.target.value })}
          />
        </Field>
        <Field label="Сайт" htmlFor="fac-url">
          <Input
            id="fac-url"
            value={values.official_url ?? ""}
            onChange={(event) => setValues({ ...values, official_url: event.target.value })}
          />
        </Field>
        <Field label="Университет" htmlFor="fac-university">
          <Select
            id="fac-university"
            value={String(values.id_university)}
            onChange={(event) =>
              setValues({ ...values, id_university: Number(event.target.value) })
            }
          >
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.short_name || university.name}
              </option>
            ))}
          </Select>
        </Field>

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
