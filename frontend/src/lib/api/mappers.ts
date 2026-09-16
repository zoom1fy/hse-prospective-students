import type { Material } from "@/data/materials";
import type { Faculty, Program, University, UserProfile } from "@/types";

import { regionName, toDegree, toStudyForm } from "./references";
import type { ApiFaculty, ApiMaterial, ApiProgram, ApiUniversity, ApiUser } from "./types";

function admissionDeadline(isActive: boolean): string {
  const year = new Date().getFullYear();
  return isActive ? `${year + 1}-07-25` : `${year - 1}-08-01`;
}

export function mapApiUniversity(api: ApiUniversity): University {
  return {
    id: String(api.id),
    slug: String(api.id),
    name: api.name,
    shortName: api.short_name || api.name,
    city: regionName(api.id_region),
    founded: 1990,
    ranking: 0,
    rating: 4.5,
    students: 0,
    about: api.description || "",
    tags: [],
    website: api.official_url || "",
    facultyIds: [],
    ...(api.logo ? { logo: api.logo } : {}),
  };
}

export function mapApiFaculty(api: ApiFaculty): Faculty {
  return {
    id: String(api.id),
    slug: String(api.id),
    name: api.name,
    shortName: api.short_name || api.name,
    about: "",
  };
}

export function mapApiProgram(api: ApiProgram): Program {
  return {
    id: String(api.id),
    slug: String(api.id),
    name: api.name,
    about: api.description || "",
    degree: toDegree(api.id_education_level),
    form: toStudyForm(api.id_type_study),
    durationYears: api.duration_years,
    budgetPlaces: api.budget_places,
    paidPlaces: api.paid_places,
    tuitionPerYear: Number(api.tuition_price ?? 0),
    minScore: 0,
    deadline: admissionDeadline(api.is_active),
    languages: ["Русский"],
    exams: [],
    career: [],
    universityId: "",
    facultyId: String(api.id_faculty),
  };
}

function formatMonthYear(value: string): string {
  const formatted = new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function mapApiMaterial(api: ApiMaterial): Material {
  return {
    id: api.slug,
    title: api.title,
    description: api.description,
    href: `/materials/${api.slug}`,
    icon: api.icon,
    readTime: api.read_time,
    updatedAt: formatMonthYear(api.updated_at),
    sections: api.sections.map((section) => ({
      heading: section.heading,
      paragraphs: section.paragraphs,
    })),
  };
}

export function mapApiUserToProfile(api: ApiUser): UserProfile {
  return {
    id: String(api.id),
    isAdmin: api.is_admin ?? false,
    email: api.email,
    phone: null,
    region: api.id_region != null ? regionName(api.id_region) : null,
    education: api.education,
    fullName: {
      last: api.last_name,
      first: api.first_name,
      middle: api.patronymic,
    },
    diplomas: (api.diplomas ?? []).map((diploma) => ({
      id: String(diploma.id),
      typeId: diploma.id_diploma_type,
      typeName: diploma.type_name,
      name: diploma.name,
      institution: diploma.institution,
      year: diploma.year,
      averageScore: diploma.average_score,
    })),
    achievements: (api.achievements ?? []).map((achievement) => ({
      id: String(achievement.id),
      name: achievement.name,
      category: achievement.category_name || null,
    })),
  };
}