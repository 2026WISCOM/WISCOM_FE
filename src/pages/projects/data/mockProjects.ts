import projectPlaceholder from "../../../assets/project-placeholder.svg";

const MOCK_MEMBER_NAMES = ["김미주", "김은서", "이채은", "황민지", "장은선"];

export const MOCK_PROJECTS = Array.from({ length: 12 }, (_, index) => ({
  id: `project-${index + 1}`,
  title: `프로젝트 ${String(index + 1).padStart(2, "0")}`,
  description: "프로젝트를 소개하는 간단한 설명입니다.",
  image: projectPlaceholder,
  members: MOCK_MEMBER_NAMES.slice(0, 3 + (index % 3)),
}));
