import type { Participant } from "../types/participant";
import { compareTeamNames } from "../utils/teamOrder";
import { PROJECTS } from "./projects";

export const PARTICIPANTS: Participant[] = PROJECTS.flatMap((project) =>
  project.members.map((member, index) => ({
    id: `${project.id}-member-${index + 1}`,
    name: member.name,
    teamName: project.teamName,
    studioNumber: project.studioNumber,
    projectId: project.id,
    projectImage: project.image,
  })),
).sort((first, second) =>
  first.name.localeCompare(second.name, "ko") || compareTeamNames(first.teamName, second.teamName),
);
