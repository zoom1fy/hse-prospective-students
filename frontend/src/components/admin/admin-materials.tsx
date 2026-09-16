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
  createMaterial,
  deleteMaterial,
  getAllMaterials,
  updateMaterial,
} from "@/lib/api/admin";
import type { ApiMaterial, ApiMaterialInput } from "@/lib/api/types";

const iconOptions = ["BookOpen", "FileText", "Award", "Wallet", "GraduationCap"];

interface SectionForm {
  heading: string;
  paragraphs: string;
}

interface MaterialForm {
  slug: string;
  title: string;
  description: string;
  icon: string;
  read_time: string;
  is_published: boolean;
  sections: SectionForm[];
}

export function AdminMaterials() {
  const [materials, setMaterials] = useState<ApiMaterial[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [editing, setEditing] = useState<ApiMaterial | "new" | null>(null);
  const [removing, setRemoving] = useState<ApiMaterial | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const loaded = await getAllMaterials();
        if (cancelled) return;
        setMaterials(loaded);
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

  async function handleDelete(material: ApiMaterial) {
    setError("");
    try {
      await deleteMaterial(material.id);
      setRemoving(null);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить материал");
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Админ-панель"
        title="Материалы"
        description="Статьи и гайды для абитуриентов: разделы, статус публикации и содержимое."
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-4" />
            Добавить материал
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
          Не удалось загрузить материалы.
        </div>
      ) : null}

      {state === "ready" ? (
        <div className="mt-6 flex flex-col gap-4">
          {materials.map((material) => (
            <Card key={material.id}>
              <CardContent className="flex flex-wrap items-start justify-between gap-4 p-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-tight">{material.title}</h3>
                    {material.is_published ? (
                      <Badge variant="success">Опубликован</Badge>
                    ) : (
                      <Badge variant="neutral">Черновик</Badge>
                    )}
                    <Badge variant="outline">{material.icon}</Badge>
                  </div>
                  <p className="text-muted mt-2 max-w-3xl text-sm">{material.description}</p>
                  <p className="text-muted mt-2 text-xs">
                    /materials/{material.slug} · {material.read_time} · разделов:{" "}
                    {material.sections.length}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Редактировать"
                    onClick={() => setEditing(material)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Удалить"
                    onClick={() => setRemoving(material)}
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {editing ? (
        <MaterialModal
          material={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      ) : null}

      {removing ? (
        <ConfirmDelete
          material={removing}
          onClose={() => setRemoving(null)}
          onConfirm={() => handleDelete(removing)}
        />
      ) : null}
    </div>
  );
}

function ConfirmDelete({
  material,
  onClose,
  onConfirm,
}: {
  material: ApiMaterial;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <Modal
      open
      onClose={onClose}
      title="Удалить материал?"
      description={`«${material.title}» будет удалён безвозвратно.`}
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

function MaterialModal({
  material,
  onClose,
  onSaved,
}: {
  material: ApiMaterial | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<MaterialForm>(() => ({
    slug: material?.slug ?? "",
    title: material?.title ?? "",
    description: material?.description ?? "",
    icon: material?.icon ?? "FileText",
    read_time: material?.read_time ?? "5 мин",
    is_published: material?.is_published ?? true,
    sections:
      material?.sections.map((section) => ({
        heading: section.heading,
        paragraphs: section.paragraphs.join("\n"),
      })) ?? [{ heading: "", paragraphs: "" }],
  }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.slug.trim() || !form.title.trim() || !form.description.trim()) {
      setError("Заполните slug, заголовок и описание.");
      return;
    }

    const payload: ApiMaterialInput = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      icon: form.icon,
      read_time: form.read_time.trim() || "5 мин",
      is_published: form.is_published,
      sections: form.sections
        .filter((section) => section.heading.trim())
        .map((section) => ({
          heading: section.heading.trim(),
          paragraphs: section.paragraphs
            .split("\n")
            .map((paragraph) => paragraph.trim())
            .filter(Boolean),
        })),
    };

    setSaving(true);
    setError("");
    try {
      if (material) await updateMaterial(material.id, payload);
      else await createMaterial(payload);
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
      title={material ? "Редактирование материала" : "Новый материал"}
      className="sm:max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug" htmlFor="mat-slug">
            <Input
              id="mat-slug"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
              placeholder="choose-direction"
            />
          </Field>
          <Field label="Иконка" htmlFor="mat-icon">
            <Select
              id="mat-icon"
              value={form.icon}
              onChange={(event) => setForm({ ...form, icon: event.target.value })}
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Заголовок" htmlFor="mat-title">
          <Input
            id="mat-title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
        </Field>

        <Field label="Описание" htmlFor="mat-description">
          <Textarea
            id="mat-description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Время чтения" htmlFor="mat-read">
            <Input
              id="mat-read"
              value={form.read_time}
              onChange={(event) => setForm({ ...form, read_time: event.target.value })}
              placeholder="5 мин"
            />
          </Field>
          <label className="text-foreground mt-6 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(event) => setForm({ ...form, is_published: event.target.checked })}
              className="size-4"
            />
            Опубликован
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Разделы</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setForm({
                  ...form,
                  sections: [...form.sections, { heading: "", paragraphs: "" }],
                })
              }
            >
              <Plus className="size-4" />
              Раздел
            </Button>
          </div>

          {form.sections.map((section, index) => (
            <div key={index} className="border-border flex flex-col gap-3 rounded-xl border p-4">
              <div className="flex items-end gap-2">
                <Field label="Заголовок раздела" htmlFor={`mat-section-${index}`} className="flex-1">
                  <Input
                    id={`mat-section-${index}`}
                    value={section.heading}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        sections: form.sections.map((item, i) =>
                          i === index ? { ...item, heading: event.target.value } : item,
                        ),
                      })
                    }
                  />
                </Field>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Удалить раздел"
                  onClick={() =>
                    setForm({
                      ...form,
                      sections: form.sections.filter((_, i) => i !== index),
                    })
                  }
                >
                  <Trash className="size-4" />
                </Button>
              </div>
              <Field
                label="Абзацы (по одному на строку)"
                htmlFor={`mat-paragraphs-${index}`}
              >
                <Textarea
                  id={`mat-paragraphs-${index}`}
                  value={section.paragraphs}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      sections: form.sections.map((item, i) =>
                        i === index ? { ...item, paragraphs: event.target.value } : item,
                      ),
                    })
                  }
                />
              </Field>
            </div>
          ))}
        </div>

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
