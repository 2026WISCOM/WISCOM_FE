import { MOCK_PROJECTS } from "../../projects/data/mockProjects";

export const GUESTBOOK_TEAMS = MOCK_PROJECTS
  .map(({ id, teamName }) => ({ id, teamName }))
  .toSorted((first, second) => first.teamName.localeCompare(second.teamName, "ko", { numeric: true }));

export const MOCK_GUESTBOOK_ENTRIES = MOCK_PROJECTS.flatMap((project, index) => [
  {
    id: `guestbook-${index + 1}-1`,
    projectId: project.id,
    author: `방문객 ${index + 1}`,
    content: `${project.teamName}의 프로젝트 잘 봤습니다. 앞으로의 도전도 응원할게요!`,
  },
  {
    id: `guestbook-${index + 1}-2`,
    projectId: project.id,
    author: "전시 관람객",
    content: "오랜 시간 준비한 노력이 느껴지는 전시였어요. 졸업을 축하합니다!",
  },
]);
