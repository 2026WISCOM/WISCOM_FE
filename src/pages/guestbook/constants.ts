import type { ProjectTeam } from "../../types/project";
import { PROJECTS } from "../../data/projects";
import { compareTeamNames } from "../../utils/teamOrder";

export const ALL_GUESTBOOK_FILTER_ID = "";
export const EVERYONE_RECIPIENT: ProjectTeam = { id: "team:모두에게", teamName: "모두에게" };
export const GUESTBOOK_TEAMS: readonly ProjectTeam[] = [
  EVERYONE_RECIPIENT,
  ...PROJECTS.map(({ teamName }) => teamName)
    .toSorted(compareTeamNames)
    .map((teamName) => ({ id: `team:${teamName}`, teamName })),
];
export const AUTHOR_MAX_LENGTH = 30;
export const MESSAGE_MAX_LENGTH = 500;
