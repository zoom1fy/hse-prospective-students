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
  createProgram,
  deleteProgram,
  getAdminPrograms,
  getEducationLevels,
  getFaculties,
  getStudyTypes,
  getUniversities,
  updateProgram,
} from "@/lib/api/admin";
import type {
  ApiFaculty,
  ApiProgram,
  ApiProgramInput,
  ApiReference,
  ApiUniversity,
} from "@/lib/api/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function AdminPrograms() {
  const [programs, setPrograms] = useState<ApiProgram[]>([]);
  const [faculties, setFaculties] = useState<ApiFaculty[]>([]);
  const [universities, setUniversities] = useState<ApiUniversity[]>([]);
  const [levels, setLevels] = useState<ApiReference[]>([]);
  const [studyTypes, setStudyTypes] = useState<ApiReference[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");
  const [editing, setEditing] = useState<ApiProgram | "new" | null>(null);
  const [removing, setRemoving] = useState<ApiProgram | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [loadedPrograms, loadedFaculties, loadedUniversities, loadedLevels, loadedTypes] =
          await Promise.all([
            getAdminPrograms(),
            getFaculties(),
            getUniversities(),
            getEducationLevels(),
            getStudyTypes(),
          ]);
        if (cancelled) return;
        setPrograms(loadedPrograms);
        setFaculties(loadedFaculties);
        setUniversities(loadedUniversities);
        setLevels(loadedLevels);
        setStudyTypes(loadedTypes);
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

  const facultyById = new Map(faculties.map((faculty) => [faculty.id, faculty]));
  const universityById = new Map(universities.map((university) => [university.id, university]));
  const levelById = new Map(levels.map((level) => [level.id, level.name]));
  const typeById = new Map(studyTypes.map((type) => [type.id, type.name]));

  const filtered = programs.filter((program) => {
    const faculty = facultyById.get(program.id_faculty);
    if (universityFilter && faculty?.id_university !== Number(universityFilter)) return false;
    const haystack = `${program.name} ${program.code}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  async function handleDelete(program: ApiProgram) {
    setError("");
    try {
      await deleteProgram(program.id);
      setRemoving(null);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить программу");
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Админ-панель"
        title="Программы"
        description="Направления подготовки, места, стоимость и активность набора."
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-4" />
            Добавить программу
          </Button>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск по названию или коду"
          className="max-w-xs"
        />
        <Select
          value={universityFilter}
          onChange={(event) => setUniversityFilter(event.target.value)}
          className="max-w-xs"
        >
          <option value="">Все вузы</option>
          {universities.map((university) => (
            <option key={university.id} value={university.id}>
              {university.short_name || university.name}
            </option>
          ))}
        </Select>
        <span className="text-muted ml-auto text-sm">Показано: {filtered.length}</span>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
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
          Не удалось загрузить программы.
        </div>
      ) : null}

      {state === "ready" ? (
        <Card className="mt-6">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-240 border-collapse text-sm">
                <thead>
                  <tr className="border-border text-muted border-b text-left">
                    <th className="px-4 py-3 font-medium">Программа</th>
                    <th className="px-4 py-3 font-medium">Факультет</th>
                    <th className="px-4 py-3 font-medium">Уровень</th>
                    <th className="px-4 py-3 font-medium">Форма</th>
                    <th className="px-4 py-3 font-medium">Места</th>
                    <th className="px-4 py-3 font-medium">Стоимость</th>
                    <th className="px-4 py-3 font-medium">Статус</th>
                    <th className="px-4 py-3 text-right font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((program) => {
                    const faculty = facultyById.get(program.id_faculty);
                    const university = faculty ? universityById.get(faculty.id_university) : null;
                    return (
                      <tr
                        key={program.id}
                        className="border-border hover:bg-surface-muted/40 border-b"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium">{program.name}</p>
                          <p className="text-muted text-xs">{program.code}</p>
                        </td>
                        <td className="text-muted px-4 py-3">
                          {university ? `${university.short_name ?? university.name} · ` : ""}
                          {faculty?.short_name ?? faculty?.name ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          {levelById.get(program.id_education_level) ?? "—"}
                        </td>
                        <td className="px-4 py-3">{typeById.get(program.id_type_study) ?? "—"}</td>
                        <td className="px-4 py-3">
                          {formatNumber(program.budget_places)} /{" "}
                          {formatNumber(program.paid_places)}
                        </td>
                        <td className="px-4 py-3">
                          {program.tuition_price
                            ? formatCurrency(Number(program.tuition_price))
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {program.is_active ? (
                            <Badge variant="success">Активна</Badge>
                          ) : (
                            <Badge variant="neutral">Не активна</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label="Редактировать"
                              onClick={() => setEditing(program)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label="Удалить"
                              onClick={() => setRemoving(program)}
                            >
                              <Trash className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {editing ? (
        <ProgramModal
          program={editing === "new" ? null : editing}
          faculties={faculties}
          universities={universities}
          levels={levels}
          studyTypes={studyTypes}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      ) : null}

      {removing ? (
        <ConfirmProgramDelete
          program={removing}
          onClose={() => setRemoving(null)}
          onConfirm={() => handleDelete(removing)}
        />
      ) : null}
    </div>
  );
}

function ConfirmProgramDelete({
  program,
  onClose,
  onConfirm,
}: {
  program: ApiProgram;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <Modal
      open
      onClose={onClose}
      title="Удалить программу?"
      description={`«${program.name}» будет удалена. Если есть связанные заявления, удаление не выполнится.`}
    >
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={busy}>
          Отмена
        </Button>
        <Button
          variant="danger"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await onConfirm();
            setBusy(false);
          }}
        >
          {busy ? "Удаление…" : "Удалить"}
        </Button>
      </div>
    </Modal>
  );
}

function ProgramModal({
  program,
  faculties,
  universities,
  levels,
  studyTypes,
  onClose,
  onSaved,
}: {
  program: ApiProgram | null;
  faculties: ApiFaculty[];
  universities: ApiUniversity[];
  levels: ApiReference[];
  studyTypes: ApiReference[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const universityById = new Map(universities.map((item) => [item.id, item]));
  const [values, setValues] = useState<ApiProgramInput>(() => ({
    name: program?.name ?? "",
    code: program?.code ?? "",
    description: program?.description ?? "",
    official_url: program?.official_url ?? "",
    duration_years: program?.duration_years ?? 4,
    budget_places: program?.budget_places ?? 0,
    paid_places: program?.paid_places ?? 0,
    tuition_price: program?.tuition_price != null ? Number(program.tuition_price) : null,
    is_active: program?.is_active ?? true,
    id_type_study: program?.id_type_study ?? studyTypes[0]?.id ?? 1,
    id_education_level: program?.id_education_level ?? levels[0]?.id ?? 1,
    id_faculty: program?.id_faculty ?? faculties[0]?.id ?? 1,
  }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.name.trim() || !values.code.trim()) {
      setError("Укажите название и код программы.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (program) await updateProgram(program.id, values);
      else await createProgram(values);
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
      title={program ? "Редактирование программы" : "Новая программа"}
      className="sm:max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Название" htmlFor="prog-name" className="sm:col-span-2">
            <Input
              id="prog-name"
              value={values.name}
              onChange={(event) => setValues({ ...values, name: event.target.value })}
            />
          </Field>
          <Field label="Код" htmlFor="prog-code">
            <Input
              id="prog-code"
              value={values.code}
              onChange={(event) => setValues({ ...values, code: event.target.value })}
            />
          </Field>
          <Field label="Факультет" htmlFor="prog-faculty">
            <Select
              id="prog-faculty"
              value={String(values.id_faculty)}
              onChange={(event) => setValues({ ...values, id_faculty: Number(event.target.value) })}
            >
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {universityById.get(faculty.id_university)?.short_name ??
                    universityById.get(faculty.id_university)?.name ??
                    ""}{" "}
                  — {faculty.short_name || faculty.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Уровень образования" htmlFor="prog-level">
            <Select
              id="prog-level"
              value={String(values.id_education_level)}
              onChange={(event) =>
                setValues({ ...values, id_education_level: Number(event.target.value) })
              }
            >
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Форма обучения" htmlFor="prog-type">
            <Select
              id="prog-type"
              value={String(values.id_type_study)}
              onChange={(event) =>
                setValues({ ...values, id_type_study: Number(event.target.value) })
              }
            >
              {studyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Срок обучения, лет" htmlFor="prog-duration">
            <Input
              id="prog-duration"
              type="number"
              min={1}
              value={values.duration_years}
              onChange={(event) =>
                setValues({ ...values, duration_years: Number(event.target.value) })
              }
            />
          </Field>
          <Field label="Бюджетных мест" htmlFor="prog-budget">
            <Input
              id="prog-budget"
              type="number"
              min={0}
              value={values.budget_places}
              onChange={(event) =>
                setValues({ ...values, budget_places: Number(event.target.value) })
              }
            />
          </Field>
          <Field label="Платных мест" htmlFor="prog-paid">
            <Input
              id="prog-paid"
              type="number"
              min={0}
              value={values.paid_places}
              onChange={(event) =>
                setValues({ ...values, paid_places: Number(event.target.value) })
              }
            />
          </Field>
          <Field label="Стоимость, ₽/год" htmlFor="prog-price">
            <Input
              id="prog-price"
              type="number"
              min={0}
              value={values.tuition_price ?? ""}
              onChange={(event) =>
                setValues({
                  ...values,
                  tuition_price: event.target.value ? Number(event.target.value) : null,
                })
              }
            />
          </Field>
          <Field label="Сайт программы" htmlFor="prog-url" className="sm:col-span-2">
            <Input
              id="prog-url"
              value={values.official_url ?? ""}
              onChange={(event) => setValues({ ...values, official_url: event.target.value })}
            />
          </Field>
        </div>

        <Field label="Описание" htmlFor="prog-description">
          <Textarea
            id="prog-description"
            value={values.description ?? ""}
            onChange={(event) => setValues({ ...values, description: event.target.value })}
          />
        </Field>

        <label className="text-foreground flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.is_active}
            onChange={(event) => setValues({ ...values, is_active: event.target.checked })}
            className="size-4"
          />
          Активный набор
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
