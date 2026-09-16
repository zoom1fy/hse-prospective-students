import {
  getAllProgramsWithContext as getMockAllProgramsWithContext,
  getCities as getMockCities,
  getFaculties as getMockFaculties,
  getProgram as getMockProgram,
  getProgramsByFaculty as getMockProgramsByFaculty,
  getUniversity as getMockUniversity,
  universities as mockUniversities,
  withContext as mockWithContext,
  type UniversityFilters,
} from "@/data/universities";
import type {
  DiplomaType,
  Faculty,
  ProgramRecommendation,
  ProgramWithContext,
  University,
  UserProfile,
} from "@/types";

import { apiDelete, apiGet, apiPatch, apiPost, buildQuery, isApiConfigured } from "./client";
import { mapApiFaculty, mapApiProgram, mapApiUniversity, mapApiUserToProfile } from "./mappers";
import { regionName } from "./references";
import type {
  ApiDiploma,
  ApiDiplomaCreate,
  ApiDiplomaType,
  ApiFaculty,
  ApiProgram,
  ApiRecommendation,
  ApiStatement,
  ApiStatementTreeResponse,
  ApiStatementTreeUniversity,
  ApiUniversity,
  ApiUser,
  ApiUserUpdate,
} from "./types";

export interface Catalog {
  programs: ProgramWithContext[];
  cities: string[];
}

export interface UniversityFacultyGroup {
  faculty: Faculty;
  programs: ProgramWithContext[];
}

function mockCatalog(): Catalog {
  return {
    programs: getMockAllProgramsWithContext(),
    cities: getMockCities(),
  };
}

export function filterPrograms(
  programs: ProgramWithContext[],
  filters: UniversityFilters,
): ProgramWithContext[] {
  const query = filters.query?.trim().toLowerCase();

  return programs.filter((item) => {
    if (query) {
      const haystack =
        `${item.name} ${item.university.name} ${item.university.shortName} ${item.faculty.name} ${item.faculty.shortName}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.city && filters.city !== "all" && item.university.city !== filters.city) {
      return false;
    }
    if (filters.degree && filters.degree !== "all" && item.degree !== filters.degree) {
      return false;
    }
    if (filters.form && filters.form !== "all" && item.form !== filters.form) {
      return false;
    }
    if (filters.direction && filters.direction !== "all" && item.name !== filters.direction) {
      return false;
    }
    if (filters.minScore && item.minScore > filters.minScore) {
      return false;
    }
    if (filters.budgetOnly && item.budgetPlaces <= 0) {
      return false;
    }
    return true;
  });
}

export async function getCatalog(): Promise<Catalog> {
  if (!isApiConfigured()) {
    return mockCatalog();
  }

  try {
    const [apiUniversities, apiFaculties, apiPrograms] = await Promise.all([
      apiGet<ApiUniversity[]>("/api/universities/"),
      apiGet<ApiFaculty[]>("/api/faculties/"),
      apiGet<ApiProgram[]>("/api/programs/"),
    ]);

    if (!apiPrograms.length) {
      return mockCatalog();
    }

    const universitiesById = new Map(apiUniversities.map((item) => [item.id, item]));
    const facultiesById = new Map(apiFaculties.map((item) => [item.id, item]));

    const programs = apiPrograms.flatMap((apiProgram) => {
      const faculty = facultiesById.get(apiProgram.id_faculty);
      if (!faculty) return [];
      const university = universitiesById.get(faculty.id_university);
      if (!university) return [];
      return [
        {
          ...mapApiProgram(apiProgram),
          university: mapApiUniversity(university),
          faculty: mapApiFaculty(faculty),
        },
      ];
    });

    const cities = [...new Set(apiUniversities.map((item) => regionName(item.id_region)))].sort(
      (a, b) => a.localeCompare(b, "ru"),
    );

    return { programs, cities };
  } catch {
    return mockCatalog();
  }
}

export async function getUniversityBySlug(slug: string): Promise<University | null> {
  if (!isApiConfigured() || !/^\d+$/.test(slug)) {
    return getMockUniversity(slug) ?? null;
  }

  try {
    const api = await apiGet<ApiUniversity>(`/api/universities/${slug}`);
    return mapApiUniversity(api);
  } catch {
    return null;
  }
}

export async function getUniversityGroups(
  university: University,
): Promise<UniversityFacultyGroup[]> {
  if (!isApiConfigured()) {
    return getMockFaculties(university).flatMap((faculty) => {
      const groupedPrograms = getMockProgramsByFaculty(faculty.id)
        .map(mockWithContext)
        .filter((item): item is ProgramWithContext => Boolean(item));
      return [{ faculty, programs: groupedPrograms }];
    });
  }

  try {
    const [apiFaculties, apiPrograms] = await Promise.all([
      apiGet<ApiFaculty[]>(`/api/faculties/${buildQuery({ university_id: university.id })}`),
      apiGet<ApiProgram[]>(`/api/programs/${buildQuery({ university_id: university.id })}`),
    ]);

    return apiFaculties.map((apiFaculty) => {
      const faculty = mapApiFaculty(apiFaculty);
      const programs = apiPrograms
        .filter((item) => item.id_faculty === apiFaculty.id)
        .map((item) => ({ ...mapApiProgram(item), university, faculty }));
      return { faculty, programs };
    });
  } catch {
    return [];
  }
}

export async function getPopularPrograms(limit = 6): Promise<ProgramWithContext[]> {
  const { programs } = await getCatalog();
  return programs.sort((a, b) => b.university.rating - a.university.rating).slice(0, limit);
}

export async function getProgramPage(
  universitySlug: string,
  programSlug: string,
): Promise<ProgramWithContext | null> {
  if (!isApiConfigured() || !/^\d+$/.test(programSlug)) {
    const program = getMockProgram(universitySlug, programSlug);
    if (!program) return null;
    return mockWithContext(program) ?? null;
  }

  try {
    const apiProgram = await apiGet<ApiProgram>(`/api/programs/${programSlug}`);
    const apiFaculty = await apiGet<ApiFaculty>(`/api/faculties/${apiProgram.id_faculty}`);
    const apiUniversity = await apiGet<ApiUniversity>(
      `/api/universities/${apiFaculty.id_university}`,
    );
    return {
      ...mapApiProgram(apiProgram),
      university: mapApiUniversity(apiUniversity),
      faculty: mapApiFaculty(apiFaculty),
    };
  } catch {
    return null;
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  if (!isApiConfigured()) {
    return null;
  }

  try {
    const api = await apiGet<ApiUser>("/api/users/me");
    return mapApiUserToProfile(api);
  } catch {
    return null;
  }
}

export async function updateUserProfile(data: ApiUserUpdate): Promise<UserProfile | null> {
  if (!isApiConfigured()) {
    return null;
  }

  try {
    const api = await apiPatch<ApiUser>("/api/users/me", data);
    return mapApiUserToProfile(api);
  } catch {
    return null;
  }
}

export async function getDiplomaTypes(): Promise<DiplomaType[]> {
  if (!isApiConfigured()) {
    return [];
  }

  try {
    return await apiGet<ApiDiplomaType[]>("/api/references/diploma-types");
  } catch {
    return [];
  }
}

export async function createDiploma(data: ApiDiplomaCreate): Promise<ApiDiploma | null> {
  if (!isApiConfigured()) {
    return null;
  }

  try {
    return await apiPost<ApiDiploma>("/api/users/me/diplomas", data);
  } catch {
    return null;
  }
}

export async function deleteDiploma(id: string): Promise<boolean> {
  if (!isApiConfigured()) {
    return false;
  }

  try {
    await apiDelete(`/api/users/me/diplomas/${id}`);
    return true;
  } catch {
    return false;
  }
}

export async function getStatementsCount(): Promise<number> {
  if (!isApiConfigured()) {
    return 0;
  }

  try {
    const statements = await apiGet<ApiStatement[]>("/api/statements/");
    return statements.length;
  } catch {
    return 0;
  }
}

export async function getStatementTree(): Promise<ApiStatementTreeUniversity[]> {
  if (!isApiConfigured()) {
    return [];
  }

  try {
    const tree = await apiGet<ApiStatementTreeResponse>("/api/statements/tree");
    return tree.universities;
  } catch {
    return [];
  }
}

async function mapRecommendations(
  apiRecommendations: ApiRecommendation[],
): Promise<ProgramRecommendation[]> {
  const catalog = await getCatalog();
  const programsById = new Map(catalog.programs.map((program) => [program.id, program]));

  return apiRecommendations.flatMap((recommendation) => {
    const program = programsById.get(String(recommendation.id_program));
    if (!program) return [];
    const reasons = recommendation.explanation ? [recommendation.explanation] : [];
    return [{ program, score: recommendation.rank ?? 0, reasons }];
  });
}

export async function getCurrentUserRecommendations(): Promise<ProgramRecommendation[]> {
  if (!isApiConfigured()) {
    return [];
  }

  try {
    const apiRecommendations = await apiGet<ApiRecommendation[]>("/api/recommendations/");
    return await mapRecommendations(apiRecommendations);
  } catch {
    return [];
  }
}

export async function generateCurrentUserRecommendations(
  topN = 6,
): Promise<ProgramRecommendation[]> {
  if (!isApiConfigured()) {
    return [];
  }

  try {
    const apiRecommendations = await apiPost<ApiRecommendation[]>("/api/recommendations/generate", {
      top_n: topN,
    });
    return await mapRecommendations(apiRecommendations);
  } catch {
    return [];
  }
}

export async function getUniversities(): Promise<University[]> {
  if (!isApiConfigured()) {
    return [...mockUniversities];
  }

  try {
    const apiUniversities = await apiGet<ApiUniversity[]>("/api/universities/");
    return apiUniversities.map(mapApiUniversity);
  } catch {
    return [...mockUniversities];
  }
}
