import { ALL_GUESTBOOK_FILTER_ID, EVERYONE_RECIPIENT, GUESTBOOK_TEAMS } from "./constants";
import type { GuestbookEntry } from "../../types/guestbook";
import type { ProjectTeam } from "../../types/project";
import { MOCK_PROJECTS } from "../projects/data/mockProjects";
import { compareTeamNames } from "./teamOrder";

export function getInitialGuestbookFilter(searchParams: URLSearchParams) {
  const teamId = searchParams.get("teamId");
  if (teamId !== null) return `team:${teamId}`;

  // Existing project links still use projectId until the project API is available.
  const projectId = searchParams.get("projectId");
  const project = MOCK_PROJECTS.find(({ id }) => id === projectId);
  return project ? `team:${project.teamName}` : ALL_GUESTBOOK_FILTER_ID;
}

export function getRecipientTeamId(recipientId: string) {
  return recipientId.slice("team:".length);
}

export function getGuestbookTeams(entries: readonly GuestbookEntry[], selectedFilterId: string): ProjectTeam[] {
  const teamIds = new Set([
    ...GUESTBOOK_TEAMS.map(({ teamName }) => teamName),
    ...entries.map(({ teamId }) => teamId),
  ]);
  if (selectedFilterId !== ALL_GUESTBOOK_FILTER_ID) {
    teamIds.add(getRecipientTeamId(selectedFilterId));
  }
  teamIds.delete(EVERYONE_RECIPIENT.teamName);

  return [...teamIds]
    .toSorted(compareTeamNames)
    .map((teamId) => ({ id: `team:${teamId}`, teamName: teamId || "수신 팀 미지정" }));
}

export function getGuestbookFilters(teams: readonly ProjectTeam[]) {
  return [
    { id: ALL_GUESTBOOK_FILTER_ID, label: "전체" },
    ...[EVERYONE_RECIPIENT, ...teams].map(({ id, teamName }) => ({ id, label: teamName })),
  ];
}

export function filterGuestbookEntries(entries: readonly GuestbookEntry[], filterId: string) {
  if (filterId === ALL_GUESTBOOK_FILTER_ID) return entries;
  const teamId = getRecipientTeamId(filterId);
  return entries.filter((entry) => entry.teamId === teamId);
}
