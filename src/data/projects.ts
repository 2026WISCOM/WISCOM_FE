import project10Image from "../assets/optimized/team/BE1_project.webp";
import project10Thumbnail from "../assets/optimized/team/BE1_project_thumb.webp";
import project10TeamImage from "../assets/optimized/team/BE1_team.webp";
import project4Image from "../assets/optimized/team/아자쓰_project.webp";
import project4Thumbnail from "../assets/optimized/team/아자쓰_project_thumb.webp";
import project4TeamImage from "../assets/optimized/team/아자쓰_team.webp";
import project11Image from "../assets/optimized/team/Axis_project.webp";
import project11Thumbnail from "../assets/optimized/team/Axis_project_thumb.webp";
import project11TeamImage from "../assets/optimized/team/Axis_team.webp";
import project3Image from "../assets/optimized/team/2233_project.webp";
import project3Thumbnail from "../assets/optimized/team/2233_project_thumb.webp";
import project3TeamImage from "../assets/optimized/team/2233_team.webp";
import project12Image from "../assets/optimized/team/가디언즈_project.webp";
import project12Thumbnail from "../assets/optimized/team/가디언즈_project_thumb.webp";
import project12TeamImage from "../assets/optimized/team/가디언즈_team.webp";
import project7Image from "../assets/optimized/team/exit(0)_project.webp";
import project7Thumbnail from "../assets/optimized/team/exit(0)_project_thumb.webp";
import project7TeamImage from "../assets/optimized/team/exit(0)_team.webp";
import project5Image from "../assets/optimized/team/공일공일_project.webp";
import project5Thumbnail from "../assets/optimized/team/공일공일_project_thumb.webp";
import project5TeamImage from "../assets/optimized/team/공일공일_team.webp";
import project9Image from "../assets/optimized/team/404_project.webp";
import project9Thumbnail from "../assets/optimized/team/404_project_thumb.webp";
import project9TeamImage from "../assets/optimized/team/404_team.webp";
import project1Image from "../assets/optimized/team/데드락_project.webp";
import project1Thumbnail from "../assets/optimized/team/데드락_project_thumb.webp";
import project1TeamImage from "../assets/optimized/team/데드락_team.webp";
import project6Image from "../assets/optimized/team/PolyStack_project.webp";
import project6Thumbnail from "../assets/optimized/team/PolyStack_project_thumb.webp";
import project6TeamImage from "../assets/optimized/team/PolyStack_team.webp";
import project2Image from "../assets/optimized/team/Quadcore_project.webp";
import project2Thumbnail from "../assets/optimized/team/Quadcore_project_thumb.webp";
import project2TeamImage from "../assets/optimized/team/Quadcore_team.webp";
import project8Image from "../assets/optimized/team/MOODE_project.webp";
import project8Thumbnail from "../assets/optimized/team/MOODE_project_thumb.webp";
import project8TeamImage from "../assets/optimized/team/MOODE_team.webp";
import type { Project } from "../types/project";

// Submitted exhibition content. Keep project IDs, studio assignments and member order stable.
export const PROJECTS: Project[] = [
	{
		id: "project-10",
		teamName: "BE1",
		title: "NAILY",
		description: "사용자 맞춤형 네일 팁 디자인 생성 및 3D 프린팅 시스템",
		studioNumber: 6,
		image: project10Image,
		thumbnail: project10Thumbnail,
		teamImage: project10TeamImage,
		introduction:
			"Naily는 손가락 사진으로 손톱을 실측하고 피부톤을 분석합니다. 이를 바탕으로 3D 프린팅 네일 팁 제작, AI 맞춤형 디자인 생성, AR 실시간 미리보기까지 하나의 파이프라인으로 제공하는 올인원 네일아트 서비스입니다.",
		demoFeatures: [
			"사용자의 손가락 사진 촬영을 통한 손톱 실측 및 피부톤 분석 결과 확인",
			"분석 결과에 따른 챗봇 기반 맞춤형 네일 디자인 생성",
			"3D 프린팅을 통한 맞춤형 네일 팁 실물 출력 확인",
		],
		members: [
			{ name: "노도경", roles: ["프론트엔드 개발", "AR 미리보기"] },
			{ name: "박승희", roles: ["백엔드 개발", "3D 프린터 자동화"] },
			{ name: "이예서", roles: ["도안 이미지 생성", "피부톤 분석"] },
			{ name: "이원지", roles: ["손 이미지 측정", "stl 파일 생성"] },
		],
	},
	{
		id: "project-4",
		teamName: "아자쓰!",
		title: "TTWIM",
		description:
			"AI 기반 실시간 러닝 패턴 분석을 통한 자세 교정 웨어러블 시스템",
		studioNumber: 5,
		image: project4Image,
		thumbnail: project4Thumbnail,
		teamImage: project4TeamImage,
		introduction:
			"TTWIM은 발등에 부착한 센서로 러닝 자세를 실시간 분석하는 서비스입니다. 잘못된 러닝 자세가 감지되면 AI가 음성으로 교정 방법을 안내하고, 운동 후에는 개인별 러닝 리포트와 AI 챗봇을 제공합니다.",
		demoFeatures: [
			"실시간 러닝 자세 분석 및 코칭",
			"최종 러닝 리포트",
			"러닝 기록 분석 AI 챗봇",
		],
		members: [
			{ name: "김진효", roles: ["FE", "Design", "AI"] },
			{ name: "박규리", roles: ["BE", "AI"] },
			{ name: "여현정", roles: ["BE", "AI"] },
			{ name: "윤윤지", roles: ["FE", "AI"] },
		],
	},
	{
		id: "project-11",
		teamName: "Axis",
		title: "나침발",
		description: "AI HAPTIC RUNNING BAND",
		studioNumber: 4,
		image: project11Image,
		thumbnail: project11Thumbnail,
		teamImage: project11TeamImage,
		introduction:
			"러닝 중 화면 확인 없이도 경로 안내와 운동 피드백을 받을 수 있는 햅틱 기반 스마트 러닝 밴드와 연동 앱. BLE 통신으로 좌·우 손목 밴드와 스마트폰을 연결하여 방향, 경로 이탈, 페이스 조절 정보를 진동으로 전달하며, AI 기반 페이스 조절 및 GPS 아트 기능 등을 함께 제공.",
		demoFeatures: [
			"나침발 밴드 연동 및 기본 설정",
			"러닝 경로 설정 및 아카이빙",
			"GPS 아트 자동 생성",
			"러닝 (방향 안내, 경로 이탈 감지, 도착 안내 등)",
			"러닝 中 페이스 조절 (AI 자동 페이스 조절, 목표 페이스 메이커)",
			"운동 데이터 기록 및 AI 코치 챗봇",
		],
		members: [
			{ name: "김다빈", roles: ["Client", "Server"] },
			{ name: "김미주", roles: ["Client", "Server", "Design"] },
			{ name: "박지애", roles: ["AI", "3D Printing"] },
			{ name: "심수빈", roles: ["Client", "Server"] },
			{ name: "정민주", roles: ["PM", "Client", "Server", "HW"] },
		],
	},
	{
		id: "project-3",
		teamName: "2233",
		title: "HabiTooth",
		description: "가정용 AI 구강 모니터링 디바이스",
		studioNumber: 4,
		image: project3Image,
		thumbnail: project3Thumbnail,
		teamImage: project3TeamImage,
		introduction:
			"꼼꼼히 양치해도 놓치는 곳이 걱정되지 않으신가요? HabiTooth는 집에서 촬영한 구강 이미지를 AI로 분석해 놓친 곳을 한눈에 보여주고, 치과에 가지 않아도 스스로 구강 상태를 관리할 수 있도록 돕습니다.",
		demoFeatures: [
			"HabiTooth 디바이스로 관람객의 치아 또는 전시장에 비치된 치아 모형을 촬영하며 실시간 모니터링",
			"백색광·UV 이중 촬영으로 치석과 치태를 검출하는 과정 체험",
			"AI가 검출한 치석·치태 결과를 치아별 위험도와 3D 구강 모형으로 확인",
			"분석 결과에 따른 맞춤형 구강 리포트와 관리 가이드 확인",
			"퀵메뉴를 통해 근처 치과 찾기, 구강 건강 정보 등 부가 기능 체험",
		],
		members: [
			{ name: "김나영", roles: ["Embedded", "Backend"] },
			{ name: "김서연", roles: ["Frontend", "AI"] },
			{ name: "윤지인", roles: ["PM", "Frontend"] },
			{ name: "하늘새미", roles: ["Backend", "AI"] },
		],
		githubUrl: "https://github.com/HabiTooth",
	},
	{
		id: "project-12",
		teamName: "가디언즈",
		title: "FeetFit",
		description: "멀티 센싱 기반 발 상태 분석 및 변화 관리 시스템",
		studioNumber: 3,
		image: project12Image,
		thumbnail: project12Thumbnail,
		teamImage: project12TeamImage,
		introduction:
			"FeetFit은 멀티 센서와 AI로 발의 외형·피부·하중 상태를 종합 분석하는 발 관리 서비스이다. 측정 결과를 시각화하고 변화를 추적하며, 개인별 관리 정보와 신발 추천을 제공해 일상 속 지속적인 발 관리를 돕는다.",
		demoFeatures: [
			"디바이스를 통한 발등·발바닥 촬영 및 측정 체험",
			"온·습도 및 족저 압력·좌우 균형 측정",
			"AI 기반 발 형태·피부 상태·무지외반 분석 결과 확인",
			"발 상태 종합 리포트 및 맞춤 관리 가이드 확인",
			"발 특성 기반 맞춤 신발 추천 및 추천 근거 확인",
		],
		members: [
			{ name: "김미주", roles: ["Client", "AI"] },
			{ name: "김은서", roles: ["Server", "AI"] },
			{ name: "이채은", roles: ["Client", "AI", "HW"] },
			{ name: "황민지", roles: ["Server", "AI"] },
		],
	},
	{
		id: "project-7",
		teamName: "exit(0)",
		title: "담다(Damda)",
		description: "AI기반 정밀 피부 진단과 IoT 스캐너 연동 솔루션",
		studioNumber: 3,
		image: project7Image,
		thumbnail: project7Thumbnail,
		teamImage: project7TeamImage,
		introduction:
			"IoT 스캐너로 피부를 촬영·측정하고 서버 AI(ResNet-50 멀티태스크)가 수분·탄력·모공 등 12개 지표를 정밀 추정하여, 웹에서 등급별 리포트와 피부/날씨 맞춤 화장품, 케어루틴을 추천하는 End-to-End 피부 분석 서비스입니다.",
		demoFeatures: [
			"사용자의 피부를 멀티모달 IoT 스캐너로 인식 및 촬영",
			"스캔된 이미지와 센서값을 통한 AI 피부 정밀진단",
			"진단 기반 맞춤 화장품 및 케어루틴 추천",
		],
		members: [
			{ name: "박수빈", roles: ["Backend"] },
			{ name: "박희림", roles: ["Design", "Frontend"] },
			{ name: "유수빈", roles: ["AI", "Backend", "PM"] },
			{ name: "정지민", roles: ["HW"] },
			{ name: "차서연", roles: ["HW"] },
		],
		serviceUrl: "https://damdads.netlify.app/",
		githubUrl: "https://github.com/orgs/2026-exit-0/repositories",
	},
	{
		id: "project-5",
		teamName: "공일공일",
		title: "인터뷰핏(Interview-Fit)",
		description: "AI 기반 멀티모달 분석을 활용한 맞춤형 면접 코칭 플랫폼",
		studioNumber: 2,
		image: project5Image,
		thumbnail: project5Thumbnail,
		teamImage: project5TeamImage,
		introduction:
			"Interview-Fit은 다양한 면접 환경에서 반복적으로 연습할 수 있도록 지원하는 AI 면접 코칭 서비스입니다. 답변 내용뿐 아니라 발화 속도, 습관어, 시선, 눈 깜빡임, 자세 등을 종합 분석합니다. 분석 결과를 바탕으로 STAR 평가, 강점·개선점, 모범 답안 및 맞춤형 피드백을 제공합니다.",
		demoFeatures: [
			"1:1·그룹·PT 면접 실시간 시연",
			"답변 녹화 후 AI 기반 음성·시선·자세·눈 깜빡임·STAR 분석 결과 확인",
			"답변 기반 꼬리질문 및 맞춤형 피드백·모범 답안 체험",
			"그룹 면접 참여자 비교 및 종합 리포트 확인",
		],
		members: [
			{ name: "고보영", roles: ["Server", "AI"] },
			{ name: "김은재", roles: ["Design", "Client"] },
			{ name: "김현진", roles: ["Full Stack"] },
			{ name: "배예은", roles: ["Full Stack"] },
			{ name: "조현진", roles: ["Full Stack"] },
		],
	},
	{
		id: "project-9",
		teamName: "404",
		title: "밀메이트(Meal Mate)",
		description:
			"보유 식재료와 사용자 정보를 활용한 개인 맞춤형 레시피 추천 서비스",
		studioNumber: 2,
		image: project9Image,
		thumbnail: project9Thumbnail,
		teamImage: project9TeamImage,
		introduction:
			"밀메이트(Meal Mate)는 사용자의 보유 식재료와 건강정보·취향을 분석해 맞춤형 레시피를 제안하는 AI 서비스입니다. 식약처 공공데이터와 LLM·RAG를 활용해 보유 재료와 사용자 조건을 종합적으로 반영하고, 실제 조리에 활용 가능한 레시피를 제공합니다.",
		demoFeatures: [
			"사용자의 보유 식재료와 건강정보·취향을 분석하여 맞춤형 레시피 생성",
			"영수증을 스캔하여 식재료 일괄 등록",
			"냉장고 사진을 인식하여 식재료 자동 등록",
		],
		members: [
			{ name: "김정인", roles: ["Server", "AI"] },
			{ name: "이지예", roles: ["Server", "AI"] },
			{ name: "임예진", roles: ["Design", "Client"] },
			{ name: "최예소", roles: ["Server", "AI"] },
			{ name: "편도나", roles: ["PM", "Client"] },
		],
	},
	{
		id: "project-1",
		teamName: "데드락",
		title: "Safe Route",
		description: "AI·IoT 기반 실시간 화재 훈련 대피 관리 플랫폼",
		studioNumber: 1,
		image: project1Image,
		thumbnail: project1Thumbnail,
		teamImage: project1TeamImage,
		introduction:
			"SafeRoute는 건물 도면을 AI로 분석해 훈련 경로를 자동 생성하고, IP 카메라로 혼잡·병목을 실시간 감지해 경로를 재계산, IoT 유도등으로 안내하는 화재 대피 훈련 관리 플랫폼입니다. 훈련 데이터를 자동 분석해 정량 평가 보고서까지 제공해 사후 평가 중심이던 기존 화재 대피 훈련의 한계를 극복합니다.",
		demoFeatures: [
			"건물 도면 기반 디지털 대피 지도 구성 및 CCTV·IoT 유도등 위치 설정 확인",
			"화재 발생 위치 지정에 따른 초기 대피 경로 산출 결과 확인",
			"실시간 CCTV 인원 감지 및 혼잡 상황 판단 시연 (참여형: 3명 이상 진입 시 혼잡 판정)",
			"혼잡 감지 시 화재 위치·혼잡 구간을 반영한 대피 경로 실시간 재계산 확인",
			"재계산된 경로에 따른 IoT 비상유도등 좌·우 방향 실시간 제어 체험",
			"사전 촬영 영상으로 재현한 대규모 대피 상황 전 과정 시연",
			"훈련 종료 후 대피 시간·이동 경로·혼잡 발생 구간 등 결과 데이터 확인",
		],
		members: [
			{ name: "박서현", roles: ["PM", "FE", "Design", "HW"] },
			{ name: "박소이", roles: ["FE", "Design", "HW"] },
			{ name: "박현지", roles: ["BE", "HW", "Infra"] },
			{ name: "이송민", roles: ["BE", "AI", "HW", "Infra"] },
			{ name: "최성현", roles: ["BE", "AI", "HW", "Infra"] },
		],
		serviceUrl: "https://ds-saferoute.site/",
		githubUrl: "https://github.com/DS-SafeRoute",
	},
	{
		id: "project-6",
		teamName: "PolyStack",
		title: "Re:Mind",
		description: "스마트 글러브를 활용한 노인 인지 훈련 어플리케이션",
		studioNumber: 1,
		image: project6Image,
		thumbnail: project6Thumbnail,
		teamImage: project6TeamImage,
		introduction:
			"ReMind는 노년층이 회상 질문에 답변하고 손동작 인지 훈련 게임을 수행하는 서비스입니다. 답변 텍스트의 단어 및 문장 수·감정 지표·게임 성공 횟수를 분석해 월간 인지 변화 리포트로 제공하며, 사용자와 보호자가 활동 기록과 변화 추이를 살펴볼 수 있도록 돕습니다.",
		demoFeatures: [
			"사용자가 오늘의 질문에 답변하고 답변 기록을 저장",
			"답변 텍스트 기반 단어 수, 문장 수, 감정 지표 분석 결과 확인",
			"인지 훈련 게임 플레이 후 정확도와 점수 결과 확인",
			"보호자/사용자 화면에서 월간 리포트 및 활동 기록 확인",
		],
		members: [
			{ name: "박수정", roles: ["Design", "Frontend", "Cloud", "HW"] },
			{ name: "이하늘", roles: ["PM", "Backend", "Cloud", "AI", "HW"] },
			{ name: "한원희", roles: ["Backend", "Cloud", "AI", "HW"] },
		],
		githubUrl: "https://github.com/remindSample/26_HF027",
	},
	{
		id: "project-2",
		teamName: "Quadcore",
		title: "SeatCare",
		description: "압력센서 기반 자세 교정 및 몰입도 관리 솔루션",
		studioNumber: 1,
		image: project2Image,
		thumbnail: project2Thumbnail,
		teamImage: project2TeamImage,
		introduction:
			"무너진 자세는 스스로 알아차리기 어렵고, 집중력 저하는 그 뒤에 숨어 있습니다. 방석·등받이 64채널 압력 센서로 착석 압력을 실시간으로 정밀하게 수집해 AI가 분석하고, 개인별 캘리브레이션으로 누구에게나 맞춤화된 판별을 구현한 지능형 자세 케어 시스템, SeatCare입니다.",
		demoFeatures: [
			"캘리브레이션(짧은시간동안  정자세 유지)으로 개인별 자세 기준 설정",
			"실시간 압력 히트맵과 AI 자세 판정(바른 자세·거북목·다리꼬기·의자 기대기) 확인",
			"나쁜 자세 지속 시 알림 발생 및 알림 설정·기록 체험",
			"일간 리포트, 스트레칭 등 하단 메뉴 기능 체험",
		],
		members: [
			{ name: "박현지", roles: ["Presentation"] },
			{ name: "윤예원", roles: ["Server", "Sensor Integration", "PM"] },
			{ name: "정다혜", roles: ["AI", "Data", "PM"] },
			{ name: "정아로", roles: ["Client", "PM"] },
		],
	},
	{
		id: "project-8",
		teamName: "MOOD:E",
		title: "SAFE:ON",
		description: "멀티모달 AI 기반 사고·위험 조기 감지 스마트 헬멧",
		studioNumber: 10,
		image: project8Image,
		thumbnail: project8Thumbnail,
		teamImage: project8TeamImage,
		introduction:
			"IMU·심박 센서로 낙상과 신체 이상을 즉시 감지하고, 카메라 AI가 물웅덩이·장애물 등 외부 위험을 사전 경고합니다. 사고 영상은 자동 기록되고 LLM이 보고서를 작성해 관리자 대시보드로 제공합니다.",
		demoFeatures: [
			"헬멧을 착용하고 실제 휘청거림이나 삐끗함 등의 동작을 취하면, 센서가 이를 실시간으로 감지하고 헬멧 경고음이 울리며 AI 판정 결과가 관리자 대시보드에 즉시 표시",
			"헬멧캠을 통해 장애물 등 외부 위험요소를 AI가 감지해 사전 경고하는 기능 체험",
			"심박·산소포화도 측정 및 신체 이상 단계(정상/권고/조치 필요) 확인",
			"사고 데이터 기반 LLM 사고 분석 보고서 확인 및 위험 구역 히트맵 확인",
		],
		members: [
			{ name: "강지원", roles: ["FE", "Design"] },
			{ name: "김민진", roles: ["BE", "PM", "HW", "AI"] },
			{ name: "양민지", roles: ["FE", "Client"] },
			{ name: "이지원", roles: ["BE", "HW", "AI"] },
			{ name: "주아연", roles: ["BE", "Server", "HW", "AI"] },
		],
		githubUrl: "https://github.com/orgs/moodeProject/repositories",
	},
];
