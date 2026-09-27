import type { ProjectTeam } from "../../types/project";
import { GUESTBOOK_TEAMS } from "./data/mockGuestbookEntries";

export const ALL_GUESTBOOK_FILTER_ID = "";
export const EVERYONE_RECIPIENT: ProjectTeam = { id: "all", teamName: "모두에게" };
export const AUTHOR_MAX_LENGTH = 30;
export const MESSAGE_MAX_LENGTH = 500;

export const GUESTBOOK_FILTERS = [
  { id: ALL_GUESTBOOK_FILTER_ID, label: "전체" },
  ...[EVERYONE_RECIPIENT, ...GUESTBOOK_TEAMS].map(({ id, teamName }) => ({ id, label: teamName })),
];
