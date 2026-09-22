import projectPlaceholder from "../../../assets/project-placeholder.svg";

const MOCK_MEMBERS = [
  { name: "김미주", roles: ["프론트엔드 개발"] },
  { name: "김은서", roles: ["백엔드 개발"] },
  { name: "이채은", roles: ["기획", "디자인"] },
  { name: "황민지", roles: ["기획", "백엔드 개발"] },
  { name: "장은선", roles: ["디자인", "프론트엔드 개발"] },
];

export const MOCK_PROJECTS = Array.from({ length: 12 }, (_, index) => ({
  id: `project-${index + 1}`,
  title: `프로젝트 ${String(index + 1).padStart(2, "0")}`,
  description: "프로젝트를 소개하는 간단한 설명입니다.",
  image: projectPlaceholder,
  studioNumber: Math.floor(index / 3) + 1,
  introduction: "프로젝트가 해결하려는 문제와 기획 의도를 소개하는 공간입니다.\n주요 기능과 사용 방법, 개발 과정에서의 고민을 담을 예정입니다.",
  demoFeatures: [
    "프로젝트의 주요 기능을 직접 체험할 수 있습니다.",
    "사용자 시나리오에 따른 서비스 흐름을 시연합니다.",
    "개발 과정과 구현 기술에 대한 설명을 들을 수 있습니다.",
  ],
  teamName: `팀 ${String(index + 1).padStart(2, "0")}`,
  teamImage: projectPlaceholder,
  members: MOCK_MEMBERS.slice(0, 3 + (index % 3)),
}));
