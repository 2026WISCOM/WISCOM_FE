import { ROUTES } from "../../constants/routes";

export const HOME_QUICK_LINKS = [
  { label: "참여자 찾기", path: ROUTES.participants },
  { label: "전시장 가는 길", path: ROUTES.directions },
  { label: "프로젝트 둘러보기", path: ROUTES.projects },
  { label: "부스배치도", path: ROUTES.booths },
] as const;
