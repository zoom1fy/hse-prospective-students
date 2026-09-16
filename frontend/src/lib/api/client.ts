const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const INTERNAL_API_URL = process.env.API_INTERNAL_URL ?? "";
const FETCH_TIMEOUT_MS = 8000;

const TOKEN_STORAGE_KEY = "hse-token";

function resolveApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return INTERNAL_API_URL || PUBLIC_API_URL;
  }
  // В продакшене браузер обращается к своему origin (/api): запрос проксируется nginx и rewrite Next.
  if (process.env.NODE_ENV === "production") {
    return "";
  }
  return PUBLIC_API_URL;
}

export function getApiBaseUrl(): string {
  return resolveApiBaseUrl();
}

export function isApiConfigured(): boolean {
  if (typeof window === "undefined" && process.env.NEXT_PHASE === "phase-production-build") {
    return false;
  }
  return true;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function buildQuery(
  params: Record<string, string | number | boolean | null | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Thin fetch wrapper around the backend API.
 * The backend is not wired up yet, so pages use the mock layer in `src/data`.
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {},
): Promise<T> {
  const { headers, signal, ...rest } = init;

  const response = await fetch(`${resolveApiBaseUrl()}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    signal: signal ?? AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      payload = undefined;
    }
    throw new ApiError(
      `Request to ${path} failed with ${response.status}`,
      response.status,
      payload,
    );
  }

  if (response.status === 204 || response.headers.get("Content-Length") === "0") {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function apiGet<T>(
  path: string,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {},
): Promise<T> {
  return apiFetch<T>(path, {
    method: "GET",
    ...init,
    headers: {
      ...authHeaders(),
      ...(init.headers ?? {}),
    },
  });
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {},
): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    ...init,
    headers: {
      ...authHeaders(),
      ...(init.headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {},
): Promise<T> {
  return apiFetch<T>(path, {
    method: "PATCH",
    ...init,
    headers: {
      ...authHeaders(),
      ...(init.headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function apiDelete<T = void>(
  path: string,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {},
): Promise<T> {
  return apiFetch<T>(path, {
    method: "DELETE",
    ...init,
    headers: {
      ...authHeaders(),
      ...(init.headers ?? {}),
    },
  });
}

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
