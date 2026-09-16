import { apiDelete, apiGet, apiPatch, apiPost, isApiConfigured } from "./client";
import type {
  ApiAdminStatement,
  ApiFaculty,
  ApiFacultyInput,
  ApiMaterial,
  ApiMaterialInput,
  ApiProgram,
  ApiProgramInput,
  ApiReference,
  ApiUniversity,
  ApiUniversityInput,
  ApiUser,
} from "./types";

function ensureConfigured() {
  if (!isApiConfigured()) {
    throw new Error("API не настроен");
  }
}

export async function getAdminUsers(): Promise<ApiUser[]> {
  ensureConfigured();
  return apiGet<ApiUser[]>("/api/users/");
}

export async function updateAdminUser(id: number, data: Record<string, unknown>): Promise<ApiUser> {
  ensureConfigured();
  return apiPatch<ApiUser>(`/api/users/${id}`, data);
}

export async function deleteAdminUser(id: number): Promise<void> {
  ensureConfigured();
  await apiDelete(`/api/users/${id}`);
}

export async function getUniversities(): Promise<ApiUniversity[]> {
  ensureConfigured();
  return apiGet<ApiUniversity[]>("/api/universities/");
}

export async function createUniversity(data: ApiUniversityInput): Promise<ApiUniversity> {
  ensureConfigured();
  return apiPost<ApiUniversity>("/api/universities/", data);
}

export async function updateUniversity(
  id: number,
  data: Partial<ApiUniversityInput>,
): Promise<ApiUniversity> {
  ensureConfigured();
  return apiPatch<ApiUniversity>(`/api/universities/${id}`, data);
}

export async function deleteUniversity(id: number): Promise<void> {
  ensureConfigured();
  await apiDelete(`/api/universities/${id}`);
}

export async function getFaculties(universityId?: number): Promise<ApiFaculty[]> {
  ensureConfigured();
  const query = universityId ? `?university_id=${universityId}` : "";
  return apiGet<ApiFaculty[]>(`/api/faculties/${query}`);
}

export async function createFaculty(data: ApiFacultyInput): Promise<ApiFaculty> {
  ensureConfigured();
  return apiPost<ApiFaculty>("/api/faculties/", data);
}

export async function updateFaculty(
  id: number,
  data: Partial<ApiFacultyInput>,
): Promise<ApiFaculty> {
  ensureConfigured();
  return apiPatch<ApiFaculty>(`/api/faculties/${id}`, data);
}

export async function deleteFaculty(id: number): Promise<void> {
  ensureConfigured();
  await apiDelete(`/api/faculties/${id}`);
}

export async function getAdminPrograms(): Promise<ApiProgram[]> {
  ensureConfigured();
  return apiGet<ApiProgram[]>("/api/programs/?include_inactive=true");
}

export async function createProgram(data: ApiProgramInput): Promise<ApiProgram> {
  ensureConfigured();
  return apiPost<ApiProgram>("/api/programs/", data);
}

export async function updateProgram(
  id: number,
  data: Partial<ApiProgramInput>,
): Promise<ApiProgram> {
  ensureConfigured();
  return apiPatch<ApiProgram>(`/api/programs/${id}`, data);
}

export async function deleteProgram(id: number): Promise<void> {
  ensureConfigured();
  await apiDelete(`/api/programs/${id}`);
}

export async function getAllMaterials(): Promise<ApiMaterial[]> {
  ensureConfigured();
  return apiGet<ApiMaterial[]>("/api/materials/all");
}

export async function createMaterial(data: ApiMaterialInput): Promise<ApiMaterial> {
  ensureConfigured();
  return apiPost<ApiMaterial>("/api/materials/", data);
}

export async function updateMaterial(
  id: number,
  data: Partial<ApiMaterialInput>,
): Promise<ApiMaterial> {
  ensureConfigured();
  return apiPatch<ApiMaterial>(`/api/materials/${id}`, data);
}

export async function deleteMaterial(id: number): Promise<void> {
  ensureConfigured();
  await apiDelete(`/api/materials/${id}`);
}

export async function getAdminStatements(): Promise<ApiAdminStatement[]> {
  ensureConfigured();
  return apiGet<ApiAdminStatement[]>("/api/statements/all");
}

export async function updateAdminStatement(
  id: number,
  idStatus: number,
): Promise<ApiAdminStatement> {
  ensureConfigured();
  return apiPatch<ApiAdminStatement>(`/api/statements/admin/${id}`, { id_status: idStatus });
}

export async function getRegions(): Promise<ApiReference[]> {
  ensureConfigured();
  return apiGet<ApiReference[]>("/api/references/regions");
}

export async function getEducationLevels(): Promise<ApiReference[]> {
  ensureConfigured();
  return apiGet<ApiReference[]>("/api/references/education-levels");
}

export async function getStudyTypes(): Promise<ApiReference[]> {
  ensureConfigured();
  return apiGet<ApiReference[]>("/api/references/study-types");
}

export async function getStatementStatuses(): Promise<ApiReference[]> {
  ensureConfigured();
  return apiGet<ApiReference[]>("/api/references/statement-statuses");
}
