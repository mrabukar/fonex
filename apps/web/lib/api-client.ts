import type { PaginatedResult } from "@fonex/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function extractMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (Array.isArray(record.errors) && record.errors.length > 0) {
      return record.errors
        .map((e) => (e && typeof e === "object" && "message" in e ? String(e.message) : String(e)))
        .join(", ");
    }
    if (Array.isArray(record.message)) return record.message.join(", ");
    if (typeof record.message === "string") return record.message;
  }
  return fallback;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    credentials: "include",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, extractMessage(body, res.statusText));
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function buildQueryString(
  params: Record<string, string | number | undefined>,
): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") qs.set(key, String(value));
  }
  const str = qs.toString();
  return str ? `?${str}` : "";
}

export async function fetchAllPages<T>(
  path: string,
  params: Record<string, string | number | undefined>,
): Promise<T[]> {
  const pageSize = 100;
  const first = await apiClient.get<PaginatedResult<T>>(
    `${path}${buildQueryString({ ...params, page: 1, pageSize })}`,
  );
  const rows = [...first.data];
  for (let page = 2; page <= first.totalPages; page++) {
    const next = await apiClient.get<PaginatedResult<T>>(
      `${path}${buildQueryString({ ...params, page, pageSize })}`,
    );
    rows.push(...next.data);
  }
  return rows;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
