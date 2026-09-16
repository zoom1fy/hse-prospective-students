import {
  getMaterial as getMockMaterial,
  materials as mockMaterials,
  type Material,
} from "@/data/materials";

import { apiGet, isApiConfigured } from "./client";
import { mapApiMaterial } from "./mappers";
import type { ApiMaterial } from "./types";

export async function getMaterialsCatalog(): Promise<Material[]> {
  if (!isApiConfigured()) return mockMaterials;

  try {
    const api = await apiGet<ApiMaterial[]>("/api/materials/");
    if (api.length === 0) return mockMaterials;
    return api.map(mapApiMaterial);
  } catch {
    return mockMaterials;
  }
}

export async function getMaterialBySlug(slug: string): Promise<Material | null> {
  if (!isApiConfigured()) return getMockMaterial(slug) ?? null;

  try {
    const api = await apiGet<ApiMaterial>(`/api/materials/slug/${slug}`);
    return mapApiMaterial(api);
  } catch {
    return getMockMaterial(slug) ?? null;
  }
}
