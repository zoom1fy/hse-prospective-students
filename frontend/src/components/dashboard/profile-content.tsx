"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { currentUserProfile } from "@/data/profile";
import {
  createDiploma,
  deleteDiploma,
  getDiplomaTypes,
  getUserProfile,
  updateUserProfile,
} from "@/lib/api";
import { isApiConfigured } from "@/lib/api/client";
import type { ApiDiploma, ApiDiplomaCreate, ApiUserUpdate } from "@/lib/api/types";
import type { Diploma, DiplomaType, UserProfile } from "@/types";

import { ProfileForm } from "./profile-form";
import { ProfileSidebar } from "./profile-sidebar";

const defaultDiplomaTypes: DiplomaType[] = [
  { id: 1, name: "Аттестат" },
  { id: 2, name: "Бакалавриат" },
  { id: 3, name: "Специалитет" },
  { id: 4, name: "Магистратура" },
  { id: 5, name: "Аспирантура" },
];

function mapApiDiploma(api: ApiDiploma): Diploma {
  return {
    id: String(api.id),
    typeId: api.id_diploma_type,
    typeName: api.type_name,
    name: api.name,
    institution: api.institution,
    year: api.year,
    averageScore: api.average_score,
  };
}

export function ProfileContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [diplomaTypes, setDiplomaTypes] = useState<DiplomaType[]>(defaultDiplomaTypes);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isApiConfigured()) {
        if (cancelled) return;
        setProfile(currentUserProfile);
        setState("ready");
        return;
      }

      try {
        const [fetched, types] = await Promise.all([getUserProfile(), getDiplomaTypes()]);
        if (cancelled) return;

        if (!fetched) {
          setState("error");
          return;
        }

        if (types.length > 0) setDiplomaTypes(types);
        setProfile(fetched);
        setState("ready");
      } catch {
        if (cancelled) return;
        setState("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = useCallback(async (data: ApiUserUpdate) => {
    if (!isApiConfigured()) {
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              email: data.email ?? prev.email,
              education: data.education ?? null,
              fullName: {
                last: data.last_name ?? prev.fullName.last,
                first: data.first_name ?? prev.fullName.first,
                middle: data.patronymic ?? null,
              },
            }
          : prev,
      );
      return true;
    }

    const updated = await updateUserProfile(data);
    if (!updated) return false;
    setProfile(updated);
    return true;
  }, []);

  const handleAddDiploma = useCallback(async (data: ApiDiplomaCreate) => {
    if (!isApiConfigured()) {
      const typeName =
        defaultDiplomaTypes.find((type) => type.id === data.id_diploma_type)?.name ?? "Документ";
      const diploma: Diploma = {
        id: `local-${Date.now()}`,
        typeId: data.id_diploma_type,
        typeName,
        name: data.name,
        institution: data.institution,
        year: data.year,
        averageScore: data.average_score,
      };
      setProfile((prev) => (prev ? { ...prev, diplomas: [...prev.diplomas, diploma] } : prev));
      return true;
    }

    const created = await createDiploma(data);
    if (!created) return false;
    setProfile((prev) =>
      prev ? { ...prev, diplomas: [...prev.diplomas, mapApiDiploma(created)] } : prev,
    );
    return true;
  }, []);

  const handleDeleteDiploma = useCallback(async (id: string) => {
    if (isApiConfigured()) {
      const ok = await deleteDiploma(id);
      if (!ok) return false;
    }
    setProfile((prev) =>
      prev ? { ...prev, diplomas: prev.diplomas.filter((item) => item.id !== id) } : prev,
    );
    return true;
  }, []);

  if (state === "loading") {
    return (
      <div className="border-border bg-surface text-muted rounded-xl border p-6 text-sm">
        Загрузка…
      </div>
    );
  }

  if (state === "error" || !profile) {
    return (
      <div className="border-border text-muted rounded-xl border border-dashed p-12 text-center text-sm">
        <p>Не удалось загрузить данные профиля.</p>
        <p className="mt-2">
          <Link
            href="/login"
            className="text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            Войдите в аккаунт
          </Link>{" "}
          или попробуйте позже.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px] xl:items-start">
      <ProfileForm
        profile={profile}
        diplomaTypes={diplomaTypes}
        onSave={handleSave}
        onAddDiploma={handleAddDiploma}
        onDeleteDiploma={handleDeleteDiploma}
      />
      <div className="xl:sticky xl:top-24">
        <ProfileSidebar profile={profile} />
      </div>
    </div>
  );
}
