import { ALL_GUESTBOOK_FILTER_ID, EVERYONE_RECIPIENT } from "./constants";
import type { GuestbookEntry } from "./types";

export function getRecipientProjectId(recipientId: string) {
  return recipientId === EVERYONE_RECIPIENT.id ? "" : recipientId;
}

export function filterGuestbookEntries(entries: readonly GuestbookEntry[], filterId: string) {
  if (filterId === ALL_GUESTBOOK_FILTER_ID) return entries;
  const projectId = getRecipientProjectId(filterId);
  return entries.filter((entry) => entry.projectId === projectId);
}
