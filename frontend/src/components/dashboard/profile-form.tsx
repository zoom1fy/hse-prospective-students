"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Award, BookOpen, Check, GraduationCap, Plus, Trash, User } from "@/components/ui/icons";
import { Modal } from "@/components/ui/modal";
import type { ApiDiplomaCreate, ApiUserUpdate } from "@/lib/api/types";
import type { DiplomaType, UserProfile } from "@/types";

function SectionCard({
  icon: Icon,
  title,
  description,
  action,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="bg-surface-muted text-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-xl">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <h3 className="text-base leading-6 font-semibold tracking-tight">{title}</h3>
              {description ? (
                <p className="text-muted mt-0.5 text-sm leading-5">{description}</p>
              ) : null}
            </div>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="border-border text-muted rounded-xl border border-dashed p-6 text-center text-sm">
      {text}
    </div>
  );
}

interface ProfileFormProps {
  profile: UserProfile;
  diplomaTypes: DiplomaType[];
  onSave: (data: ApiUserUpdate) => Promise<boolean>;
  onAddDiploma: (data: ApiDiplomaCreate) => Promise<boolean>;
  onDeleteDiploma: (id: string) => Promise<boolean>;
}

export function ProfileForm({
  profile,
  diplomaTypes,
  onSave,
  onAddDiploma,
  onDeleteDiploma,
}: ProfileFormProps) {
  const [lastName, setLastName] = useState(profile.fullName.last);
  const [firstName, setFirstName] = useState(profile.fullName.first);
  const [middleName, setMiddleName] = useState(profile.fullName.middle ?? "");
  const [email, setEmail] = useState(profile.email);
  const [education, setEducation] = useState(profile.education ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [diplomaModalOpen, setDiplomaModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const ok = await onSave({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      patronymic: middleName.trim() || null,
      email: email.trim(),
      education: education.trim() || null,
    });
    setSaving(false);
    if (ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    }
  }

  const addDiplomaButton = (
    <Button variant="secondary" size="sm" onClick={() => setDiplomaModalOpen(true)}>
      <Plus className="size-4" />
      Добавить
    </Button>
  );

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <SectionCard
          icon={User}
          title="Личные данные"
          description="ФИО и контакты, которые используются в заявлениях."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Фамилия" htmlFor="last-name">
              <Input
                id="last-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
              />
            </Field>
            <Field label="Имя" htmlFor="first-name">
              <Input
                id="first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
              />
            </Field>
            <Field label="Отчество" htmlFor="middle-name">
              <Input
                id="middle-name"
                value={middleName}
                onChange={(event) => setMiddleName(event.target.value)}
                autoComplete="additional-name"
              />
            </Field>
            <Field label="Email" htmlFor="profile-email">
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard
          icon={BookOpen}
          title="Дополнительное образование"
          description="Курсы, школы и другие программы обучения."
        >
          <Field label="Сведения" htmlFor="education">
            <Textarea
              id="education"
              value={education}
              onChange={(event) => setEducation(event.target.value)}
              placeholder="Например: 11 классов, курсы «Основы машинного обучения»"
            />
          </Field>
        </SectionCard>

        <div className="flex items-center justify-end gap-3">
          {saved ? (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <Check className="size-4" />
              Изменения сохранены
            </span>
          ) : null}
          <Button type="submit" size="lg" disabled={saving}>
            <Check className="size-4" />
            {saving ? "Сохранение…" : "Сохранить профиль"}
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-6">
        <SectionCard
          icon={GraduationCap}
          title="Дипломы и документы об образовании"
          description="Аттестаты и дипломы, которые учитываются при подборе."
          action={addDiplomaButton}
        >
          {profile.diplomas.length === 0 ? (
            <EmptyHint text="Документы об образовании пока не добавлены. Нажмите «Добавить», чтобы указать диплом или аттестат." />
          ) : (
            <ul className="flex flex-col gap-3">
              {profile.diplomas.map((diploma) => (
                <li
                  key={diploma.id}
                  className="border-border bg-surface-muted/40 flex items-start justify-between gap-4 rounded-xl border p-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{diploma.typeName}</Badge>
                      <span className="text-muted text-xs">{diploma.year}</span>
                      {diploma.averageScore != null ? (
                        <Badge variant="neutral">Средний балл {diploma.averageScore}</Badge>
                      ) : null}
                    </div>
                    <p className="mt-2 font-medium">{diploma.name}</p>
                    <p className="text-muted mt-0.5 text-sm">{diploma.institution}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Удалить диплом"
                    disabled={deletingId === diploma.id}
                    onClick={async () => {
                      setDeletingId(diploma.id);
                      await onDeleteDiploma(diploma.id);
                      setDeletingId(null);
                    }}
                  >
                    <Trash className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          icon={Award}
          title="Достижения"
          description="Олимпиады, спорт, волонтёрство и другие результаты."
        >
          {profile.achievements.length === 0 ? (
            <EmptyHint text="Достижения пока не добавлены." />
          ) : (
            <ul className="flex flex-col gap-3">
              {profile.achievements.map((achievement) => (
                <li
                  key={achievement.id}
                  className="border-border bg-surface-muted/40 flex items-start justify-between gap-4 rounded-xl border p-4"
                >
                  <p className="font-medium">{achievement.name}</p>
                  {achievement.category ? (
                    <Badge variant="success">{achievement.category}</Badge>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {diplomaModalOpen ? (
        <DiplomaModal
          onClose={() => setDiplomaModalOpen(false)}
          diplomaTypes={diplomaTypes}
          onSubmit={onAddDiploma}
        />
      ) : null}
    </div>
  );
}

function DiplomaModal({
  onClose,
  diplomaTypes,
  onSubmit,
}: {
  onClose: () => void;
  diplomaTypes: DiplomaType[];
  onSubmit: (data: ApiDiplomaCreate) => Promise<boolean>;
}) {
  const [typeId, setTypeId] = useState<number>(diplomaTypes[0]?.id ?? 1);
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [averageScore, setAverageScore] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !institution.trim()) {
      setError("Заполните название документа и учебное заведение.");
      return;
    }
    const yearValue = Number(year);
    if (!Number.isInteger(yearValue) || yearValue < 1900 || yearValue > 2100) {
      setError("Укажите корректный год.");
      return;
    }
    let score: number | null = null;
    if (averageScore.trim()) {
      score = Number(averageScore.replace(",", "."));
      if (Number.isNaN(score) || score < 0 || score > 5) {
        setError("Средний балл должен быть числом от 0 до 5.");
        return;
      }
    }

    setSubmitting(true);
    const ok = await onSubmit({
      id_diploma_type: typeId,
      name: name.trim(),
      institution: institution.trim(),
      year: yearValue,
      average_score: score,
    });
    setSubmitting(false);
    if (ok) onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Добавить документ об образовании"
      description="Укажите тип, название, заведение и год получения."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Тип документа" htmlFor="diploma-type">
          <Select
            id="diploma-type"
            value={typeId}
            onChange={(event) => setTypeId(Number(event.target.value))}
          >
            {diplomaTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Название" htmlFor="diploma-name">
          <Input
            id="diploma-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Аттестат о среднем общем образовании"
          />
        </Field>
        <Field label="Учебное заведение" htmlFor="diploma-institution">
          <Input
            id="diploma-institution"
            value={institution}
            onChange={(event) => setInstitution(event.target.value)}
            placeholder="ГБОУ Школа № 179"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Год получения" htmlFor="diploma-year">
            <Input
              id="diploma-year"
              type="number"
              min={1900}
              max={2100}
              value={year}
              onChange={(event) => setYear(event.target.value)}
            />
          </Field>
          <Field label="Средний балл" htmlFor="diploma-score" hint="Необязательно">
            <Input
              id="diploma-score"
              type="number"
              step="0.1"
              min={0}
              max={5}
              value={averageScore}
              onChange={(event) => setAverageScore(event.target.value)}
              placeholder="4.8"
            />
          </Field>
        </div>

        {error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </p>
        ) : null}

        <div className="mt-1 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Сохранение…" : "Добавить"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
