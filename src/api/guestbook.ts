import type { CreateGuestbookRequest, GuestbookEntry } from "../types/guestbook";
import { ApiError, request } from "./client";

function isGuestbookEntry(value: unknown): value is GuestbookEntry {
  if (!value || typeof value !== "object") return false;
  return "id" in value && typeof value.id === "number" && Number.isSafeInteger(value.id)
    && "teamId" in value && typeof value.teamId === "string"
    && "writer" in value && typeof value.writer === "string"
    && "content" in value && typeof value.content === "string"
    && "createdAt" in value && typeof value.createdAt === "string";
}

export async function getGuestbooks(signal?: AbortSignal): Promise<GuestbookEntry[]> {
  const result = await request<unknown>("/api/guestbooks", { signal });
  if (!Array.isArray(result) || !result.every(isGuestbookEntry)) {
    throw new ApiError("방명록 응답 형식이 올바르지 않습니다.");
  }
  return result;
}

export async function createGuestbook(entry: CreateGuestbookRequest): Promise<GuestbookEntry> {
  const result = await request<unknown>("/api/guestbooks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!isGuestbookEntry(result)) {
    throw new ApiError("방명록 응답 형식이 올바르지 않습니다.");
  }
  return result;
}
