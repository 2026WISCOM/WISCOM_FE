import type { ProjectTeam } from "../../types/project";
import { compareTeamNames } from "./teamOrder";

export const ALL_GUESTBOOK_FILTER_ID = "";
export const EVERYONE_RECIPIENT: ProjectTeam = { id: "team:모두에게", teamName: "모두에게" };
export const GUESTBOOK_TEAMS: readonly ProjectTeam[] = [
  EVERYONE_RECIPIENT,
  ...[
    "데드락",
    "Quadcore",
    "2233",
    "아자쓰!",
    "공일공일",
    "PolyStack",
    "exit(0)",
    "MOOD:E",
    "404",
    "BE1",
    "Axis",
    "가디언즈",
  ]
    .toSorted(compareTeamNames)
    .map((teamName) => ({ id: `team:${teamName}`, teamName })),
];
export const AUTHOR_MAX_LENGTH = 30;
export const MESSAGE_MAX_LENGTH = 500;
