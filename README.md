# WISCOM 프런트엔드

덕성여자대학교 컴퓨터공학전공 졸업 전시 웹사이트입니다.
React 19, TypeScript, React Router, Vite 8, Tailwind CSS 4를 사용합니다.

## 실행과 검증

```sh
npm ci
npm run dev
```

| 명령 | 역할 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run lint` | Oxlint 검사 |
| `npx --no-install tsc -b` | TypeScript 검사 |
| `npm run build` | TypeScript 검사 후 `dist/` 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |

TypeScript는 strict 모드와 배열·객체 인덱스 접근 검사를 사용합니다.
별도의 `typecheck` npm 스크립트는 없으며, 빌드에도 타입 검사가 포함됩니다.

## 코드 위치

```text
src/
├─ App.tsx                 # 페이지 라우트 연결
├─ constants/routes.ts    # URL과 메뉴 목록
├─ layouts/SiteLayout.tsx # 모바일 프레임, 내비게이션, 푸터, 페이지별 외형
├─ components/
│  ├─ navigation/         # 내비게이션 바와 메뉴
│  ├─ layout/             # 푸터
│  └─ ui/                 # 여러 페이지가 실제로 공유하는 UI
├─ pages/
│  ├─ *Page.tsx           # 페이지 구성과 상태 연결
│  ├─ projects/           # 프로젝트 목업 데이터
│  ├─ participants/       # 참여자 목록·필터·상세
│  ├─ booths/             # 배치도 좌표와 스튜디오 스타일
│  ├─ guestbook/          # 방명록 목록·작성·팀 선택·필터 처리
│  ├─ never-ending-story/ # 이야기 데이터와 상세
│  └─ home/               # 홈 바로가기 목록
├─ hooks/                 # 공통 모달 상태와 필터 밑줄 측정
├─ types/                 # 프로젝트·참여자·이야기 모델
├─ utils/                 # className 결합 등 공통 함수
├─ styles/                # 타이포그래피, 글래스, 배경, 모바일 프레임
├─ assets/                # 코드에서 import하는 이미지
└─ index.css              # 스타일 진입점, 테마 색상, 공통 내비게이션 간격
```

새 페이지는 `pages/`에 만들고 `constants/routes.ts`와 `App.tsx`에서 연결합니다.
페이지 전용 컴포넌트와 데이터는 해당 페이지의 하위 폴더에 둡니다.
여러 화면에서 같은 역할로 사용하는 부분만 `components/ui/`나 `hooks/`로 옮깁니다.

## 공통 UI

- `Button`, `IconButton`, `FloatingActionButton`: 일반 버튼, 아이콘 버튼, 프레임 우하단 플로팅 버튼.
- `GlassLink`: 내부 경로와 외부 URL에 사용하는 캡슐 링크.
- `ContentSection`: 작은 제목과 본문을 가진 전시·프로젝트 안내 섹션.
- `FilterBar`: 참여자 초성 필터와 방명록 가로 스크롤 필터.
- `Modal`, `Drawer`: 동일한 모바일 프레임 안에서 열리는 상세 모달과 메뉴.

`useModalDialog`는 네이티브 dialog 열기·닫기와 스크롤 잠금을 담당합니다.
`useDetailModal`은 상세 대상과 열림 상태를 함께 관리하며, 닫힘 애니메이션 동안 선택 데이터를 유지합니다.

## 데이터와 방명록 상태

현재 화면은 각 기능의 `data/mock*.ts`를 사용하며 API 호출은 없습니다.
프로젝트 목록·상세·부스·참여자·방명록 팀 목록이 같은 프로젝트 목업을 참조합니다.
공통 데이터 모델은 `types/`에, 방명록의 입력·목록 타입과 필터 규칙은 `pages/guestbook/`에 있습니다.

방명록은 페이지 메모리 상태에 저장됩니다. 새로고침하거나 다른 페이지로 이동하면 작성한 글은 초기화됩니다.
저장된 글의 `projectId: ""`는 ‘모두에게’를 뜻하며, 필터의 ‘전체’와 구분하는 변환은 방명록 유틸리티가 담당합니다.

부스 배치도 좌표는 `pages/booths/data/floorPlan.ts`에서 수정합니다.
기준 비율 `357 / 557`과 퍼센트 좌표를 유지하며, 도형과 라벨을 DOM으로 배치합니다.

## 스타일

색상은 `index.css`의 Tailwind `@theme` 토큰을 사용합니다.
예: `text-ink`, `text-muted`, `text-on-dark`, `bg-page`, `bg-navy`, `bg-pink`.
타이포그래피 이름과 수치는 [스타일 가이드](src/styles/README.md)를 참고합니다.

`pt-navbar`는 내비게이션 아래 기본 24px 여백을 포함한 상단 패딩입니다.
다른 간격이 필요한 화면은 `pt-navbar [--page-gap:43px]`처럼 해당 페이지에서 지정합니다.
`glass-effect`에 `glass-dark` 또는 `glass-light`를 조합해 반복되는 글래스 색상을 적용할 수 있습니다.
배치도처럼 동적인 퍼센트 좌표가 필요한 경우에는 `style`을 사용합니다.

## 브라우저 확인

`scripts/check-guestbook-dropdown.mjs`는 팀 선택, 작성 검증, 필터 구분, 스크롤과 밑줄 위치를 확인합니다.
Node 22 이상, 실행 중인 Vite 서버와 테스트용 Chrome의 CDP 엔드포인트가 필요합니다.

```sh
node scripts/check-guestbook-dropdown.mjs http://127.0.0.1:5178 http://127.0.0.1:9228
```

검사 스크립트는 연결된 브라우저 페이지를 방명록으로 이동시킵니다.
