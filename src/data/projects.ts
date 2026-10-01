import projectPlaceholder from "../assets/project-placeholder.svg";
import type { Project } from "../types/project";

// Ordered by exhibition space. Keep IDs stable when changing the display order.
export const PROJECTS: Project[] = [
  {
    id: "project-10",
    teamName: "BE1",
    title: "Naily: 사용자 맞춤형 네일 팁 디자인 생성 및 3D 프린팅 시스템",
    studioNumber: 6,
    members: ["노도경", "박승희", "이예서", "이원지"],
  },
  {
    id: "project-4",
    teamName: "아자쓰!",
    title: "AI 기반 실시간 러닝 패턴 분석을 통한 자세 교정 웨어러블 시스템",
    studioNumber: 5,
    members: ["김진효", "박규리", "여현정", "윤윤지"],
  },
  {
    id: "project-11",
    teamName: "Axis",
    title: "나침발: 스마트 러닝밴드",
    studioNumber: 4,
    members: ["김다빈", "김미주", "박지애", "심수빈", "정민주"],
  },
  {
    id: "project-3",
    teamName: "2233",
    title: "HabiTooth: 가정용 AI 구강 모니터링 디바이스",
    studioNumber: 4,
    members: ["김나영", "김서연", "윤지인", "하늘새미"],
  },
  {
    id: "project-12",
    teamName: "가디언즈",
    title: "FeetFit: 멀티 센서 기반 발 상태 분석 및 변화 관리 시스템",
    studioNumber: 3,
    members: ["김미주", "김은서", "이채은", "황민지"],
  },
  {
    id: "project-7",
    teamName: "exit(0)",
    title: "담다(Damda): AI기반 정밀 피부 진단과 IoT 스캐너 연동 솔루션",
    studioNumber: 3,
    members: ["박수빈", "박희림", "유수빈", "정지민", "차서연"],
  },
  {
    id: "project-5",
    teamName: "공일공일",
    title: "인터뷰핏 (Interview-Fit): 면접 태도 및 답변 내용 분석 기반의 AI 코칭 플랫폼",
    studioNumber: 2,
    members: ["고보영", "김은재", "김현진", "배예은", "조현진"],
  },
  {
    id: "project-9",
    teamName: "404",
    title: "밀메이트(MealMate): 개인 맞춤형 레시피 추천 서비스",
    studioNumber: 2,
    members: ["김정인", "이지예", "임예진", "최예소", "편도나"],
  },
  {
    id: "project-1",
    teamName: "데드락",
    title: "Safe Route: AI·IoT 기반 실시간 화재 대피 훈련 관리 플랫폼",
    studioNumber: 1,
    members: ["박서현", "박소이", "박현지", "이송민", "최성현"],
  },
  {
    id: "project-6",
    teamName: "PolyStack",
    title: "Re:Mind 스마트 장갑을 활용한 AI기반 노인 인지 향상 보조 어플리케이션",
    studioNumber: 1,
    members: ["박수정", "이하늘", "한원희"],
  },
  {
    id: "project-2",
    teamName: "Quadcore",
    title: "시트케어(SeatCare): 압력센서 기반 자세 교정 및 몰입도 관리 솔루션",
    studioNumber: 1,
    members: ["박현지", "윤예원", "정다혜", "정아로"],
  },
  {
    id: "project-8",
    teamName: "MOOD:E",
    title: "멀티모달 AI 기반 사고·위험 조기 감지 스마트 헬멧",
    studioNumber: 10,
    members: ["강지원", "김민진", "양민지", "이지원", "주아연"],
  },
].map((project) => ({
  description: "",
  image: projectPlaceholder,
  introduction: "프로젝트 상세 소개를 준비 중입니다.",
  demoFeatures: [],
  teamImage: projectPlaceholder,
  ...project,
  members: project.members.map((name) => ({ name, roles: [] })),
}));
