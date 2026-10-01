import type { ApiResponse } from "../types/api";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL?.trim() || "").replace(/\/+$/, "");

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return typeof value === "object" && value !== null
    && "isSuccess" in value && typeof value.isSuccess === "boolean"
    && "code" in value && typeof value.code === "string"
    && "message" in value && typeof value.message === "string"
    && "result" in value;
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/${path.replace(/^\/+/, "")}`, {
      ...options,
      headers,
    });
  } catch (error) {
    if (options.signal?.aborted || (error instanceof Error && error.name === "AbortError")) {
      throw error;
    }
    throw new ApiError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch (error) {
    if (options.signal?.aborted || (error instanceof Error && error.name === "AbortError")) {
      throw error;
    }
    throw new ApiError(
      response.ok ? "서버 응답을 읽을 수 없습니다." : "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      response.status,
    );
  }

  if (!response.ok || (typeof data === "object" && data !== null && "isSuccess" in data && data.isSuccess === false)) {
    const message = typeof data === "object" && data !== null
      && "message" in data && typeof data.message === "string" ? data.message : "";
    const code = typeof data === "object" && data !== null
      && "code" in data && typeof data.code === "string" ? data.code : undefined;
    throw new ApiError(message || "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.", response.status, code);
  }

  if (!isApiResponse(data)) {
    throw new ApiError("서버 응답 형식이 올바르지 않습니다.", response.status);
  }
  return data.result as T;
}
