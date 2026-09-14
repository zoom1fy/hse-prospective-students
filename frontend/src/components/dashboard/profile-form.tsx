"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { Check, Plus, Trash } from "@/components/ui/icons";
import type { Achievement, Diploma, UserProfile } from "@/types";

const diplomaTypeLabels: Record<Diploma["type"], string> = {
  school: "Аттестат",
  bachelor: "Бакалавриат",
  specialist: "Специалитет",
  master: "Магистратура",
  postgraduate: "Аспирантура",
};

const achievementLevelLabels: Record<Achievement["level"], string> = {
  international: "Международный",
  national: "Всероссийский",
  regional: "Региональный",
  university: "Вузовский",
};

function uid() {
  return `new-${Math.random().toString(36).slice(2, 9)}`;
}

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [passport, setPassport] = useState(profile.passport);
  const [snils, setSnils] = useState(profile.snils);
  const [diplomas, setDiplomas] = useState(profile.diplomas);
  const [achievements, setAchievements] = useState(profile.achievements);
  const [education, setEducation] = useState(profile.education);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Личные данные</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Фамилия" htmlFor="last">
            <Input
              id="last"
              value={fullName.last}
              onChange={(event) => setFullName({ ...fullName, last: event.target.value })}
            />
          </Field>
          <Field label="Имя" htmlFor="first">
            <Input
              id="first"
              value={fullName.first}
              onChange={(event) => setFullName({ ...fullName, first: event.target.value })}
            />
          </Field>
          <Field label="Отчество" htmlFor="middle">
            <Input
              id="middle"
              value={fullName.middle}
              onChange={(event) => setFullName({ ...fullName, middle: event.target.value })}
            />
          </Field>
          <Field label="СНИЛС" htmlFor="snils">
            <Input id="snils" value={snils} onChange={(event) => setSnils(event.target.value)} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Паспорт</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Серия" htmlFor="passport-series">
            <Input
              id="passport-series"
              value={passport.series}
              onChange={(event) => setPassport({ ...passport, series: event.target.value })}
            />
          </Field>
          <Field label="Номер" htmlFor="passport-number">
            <Input
              id="passport-number"
              value={passport.number}
              onChange={(event) => setPassport({ ...passport, number: event.target.value })}
            />
          </Field>
          <Field label="Код подразделения" htmlFor="passport-code">
            <Input
              id="passport-code"
              value={passport.departmentCode}
              onChange={(event) => setPassport({ ...passport, departmentCode: event.target.value })}
            />
          </Field>
          <Field label="Кем выдан" htmlFor="passport-issued-by" className="sm:col-span-2">
            <Input
              id="passport-issued-by"
              value={passport.issuedBy}
              onChange={(event) => setPassport({ ...passport, issuedBy: event.target.value })}
            />
          </Field>
          <Field label="Дата выдачи" htmlFor="passport-issued-at">
            <Input
              id="passport-issued-at"
              type="date"
              value={passport.issuedAt}
              onChange={(event) => setPassport({ ...passport, issuedAt: event.target.value })}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Дипломы и документы об образовании</CardTitle>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setDiplomas((items) => [
                ...items,
                {
                  id: uid(),
                  type: "school",
                  title: "",
                  institution: "",
                  year: new Date().getFullYear(),
                  averageScore: 5,
                },
              ])
            }
          >
            <Plus className="size-4" />
            Добавить
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {diplomas.map((diploma, index) => (
            <div
              key={diploma.id}
              className="border-border grid gap-4 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-5"
            >
              <Field label="Тип" htmlFor={`diploma-type-${diploma.id}`}>
                <Select
                  id={`diploma-type-${diploma.id}`}
                  value={diploma.type}
                  onChange={(event) =>
                    setDiplomas((items) =>
                      items.map((item, i) =>
                        i === index
                          ? { ...item, type: event.target.value as Diploma["type"] }
                          : item,
                      ),
                    )
                  }
                >
                  {Object.entries(diplomaTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="Название"
                htmlFor={`diploma-title-${diploma.id}`}
                className="lg:col-span-2"
              >
                <Input
                  id={`diploma-title-${diploma.id}`}
                  value={diploma.title}
                  onChange={(event) =>
                    setDiplomas((items) =>
                      items.map((item, i) =>
                        i === index ? { ...item, title: event.target.value } : item,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="Учебное заведение" htmlFor={`diploma-institution-${diploma.id}`}>
                <Input
                  id={`diploma-institution-${diploma.id}`}
                  value={diploma.institution}
                  onChange={(event) =>
                    setDiplomas((items) =>
                      items.map((item, i) =>
                        i === index ? { ...item, institution: event.target.value } : item,
                      ),
                    )
                  }
                />
              </Field>
              <div className="flex items-end gap-2">
                <Field label="Год" htmlFor={`diploma-year-${diploma.id}`} className="flex-1">
                  <Input
                    id={`diploma-year-${diploma.id}`}
                    type="number"
                    value={diploma.year}
                    onChange={(event) =>
                      setDiplomas((items) =>
                        items.map((item, i) =>
                          i === index ? { ...item, year: Number(event.target.value) } : item,
                        ),
                      )
                    }
                  />
                </Field>
                <Button
                  variant="ghost"
                  size="md"
                  aria-label="Удалить диплом"
                  onClick={() => setDiplomas((items) => items.filter((_, i) => i !== index))}
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Достижения</CardTitle>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setAchievements((items) => [
                ...items,
                {
                  id: uid(),
                  title: "",
                  level: "regional",
                  year: new Date().getFullYear(),
                  points: 0,
                },
              ])
            }
          >
            <Plus className="size-4" />
            Добавить
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="border-border grid gap-4 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <Field
                label="Название"
                htmlFor={`ach-title-${achievement.id}`}
                className="lg:col-span-2"
              >
                <Input
                  id={`ach-title-${achievement.id}`}
                  value={achievement.title}
                  onChange={(event) =>
                    setAchievements((items) =>
                      items.map((item, i) =>
                        i === index ? { ...item, title: event.target.value } : item,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="Уровень" htmlFor={`ach-level-${achievement.id}`}>
                <Select
                  id={`ach-level-${achievement.id}`}
                  value={achievement.level}
                  onChange={(event) =>
                    setAchievements((items) =>
                      items.map((item, i) =>
                        i === index
                          ? { ...item, level: event.target.value as Achievement["level"] }
                          : item,
                      ),
                    )
                  }
                >
                  {Object.entries(achievementLevelLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="flex items-end gap-2">
                <Field label="Баллы" htmlFor={`ach-points-${achievement.id}`} className="flex-1">
                  <Input
                    id={`ach-points-${achievement.id}`}
                    type="number"
                    value={achievement.points}
                    onChange={(event) =>
                      setAchievements((items) =>
                        items.map((item, i) =>
                          i === index ? { ...item, points: Number(event.target.value) } : item,
                        ),
                      )
                    }
                  />
                </Field>
                <Button
                  variant="ghost"
                  aria-label="Удалить достижение"
                  onClick={() => setAchievements((items) => items.filter((_, i) => i !== index))}
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Другое образование</CardTitle>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setEducation((items) => [
                ...items,
                { id: uid(), title: "", institution: "", year: new Date().getFullYear() },
              ])
            }
          >
            <Plus className="size-4" />
            Добавить
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {education.map((item, index) => (
            <div
              key={item.id}
              className="border-border grid gap-4 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <Field label="Название" htmlFor={`edu-title-${item.id}`}>
                <Input
                  id={`edu-title-${item.id}`}
                  value={item.title}
                  onChange={(event) =>
                    setEducation((items) =>
                      items.map((entry, i) =>
                        i === index ? { ...entry, title: event.target.value } : entry,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="Организация" htmlFor={`edu-institution-${item.id}`}>
                <Input
                  id={`edu-institution-${item.id}`}
                  value={item.institution}
                  onChange={(event) =>
                    setEducation((items) =>
                      items.map((entry, i) =>
                        i === index ? { ...entry, institution: event.target.value } : entry,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="Год" htmlFor={`edu-year-${item.id}`}>
                <Input
                  id={`edu-year-${item.id}`}
                  type="number"
                  value={item.year}
                  onChange={(event) =>
                    setEducation((items) =>
                      items.map((entry, i) =>
                        i === index ? { ...entry, year: Number(event.target.value) } : entry,
                      ),
                    )
                  }
                />
              </Field>
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  aria-label="Удалить запись"
                  onClick={() => setEducation((items) => items.filter((_, i) => i !== index))}
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg">
          <Check className="size-4" />
          Сохранить профиль
        </Button>
        {saved ? <span className="text-sm text-emerald-600">Изменения сохранены</span> : null}
      </div>
    </form>
  );
}
