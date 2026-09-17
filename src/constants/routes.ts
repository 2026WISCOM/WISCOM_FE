export const ROUTES = {
  splash: "/",
  home: "/home",
  participants: "/participants",
  exhibition: "/exhibition",
  directions: "/directions",
  projects: "/projects",
  projectDetail: "/projects/:projectId",
  booths: "/booths",
  guestbook: "/guestbook",
  behind: "/behind",
} as const;

export const NAVIGATION_ITEMS = [
  { label: "전시 소개", path: ROUTES.exhibition },
  { label: "오시는 길", path: ROUTES.directions },
  { label: "참여한 사람들", path: ROUTES.participants },
  { label: "프로젝트", path: ROUTES.projects },
  { label: "부스배치도", path: ROUTES.booths },
  { label: "방명록", path: ROUTES.guestbook },
  { label: "비하인드", path: ROUTES.behind },
] as const;
