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
├─ api/                   # 공통 fetch 클라이언트와 기능별 API 요청
├─ data/                  # 프로젝트 원본과 여기서 파생한 참여자 목록
├─ components/
│  ├─ navigation/         # 내비게이션 바와 메뉴
│  ├─ layout/             # 푸터
│  └─ ui/                 # 여러 페이지가 실제로 공유하는 UI
├─ pages/
│  ├─ *Page.tsx           # 페이지 구성과 상태 연결
│  ├─ participants/       # 참여자 목록·필터·상세
│  ├─ booths/             # 배치도 좌표와 스튜디오 스타일
│  ├─ guestbook/          # 방명록 목록·작성·팀 선택·필터 처리
│  ├─ never-ending-story/ # 이야기 데이터와 상세
│  └─ home/               # 홈 바로가기 목록
├─ hooks/                 # 공통 모달 상태와 필터 밑줄 측정
├─ types/                 # 공통 API 응답과 프로젝트·참여자·이야기·방명록 모델
├─ utils/                 # className 결합 등 공통 함수
├─ styles/                # 타이포그래피, 글래스, 배경, 모바일 프레임
├─ assets/                # 코드에서 import하는 이미지
└─ index.css              # 스타일 진입점, 테마 색상, 공통 내비게이션 간격
```

새 페이지는 `pages/`에 만들고 `constants/routes.ts`와 `App.tsx`에서 연결합니다.
페이지 전용 컴포넌트와 데이터는 해당 페이지의 하위 폴더에 둡니다.
여러 화면에서 같은 역할로 사용하는 부분만 `components/ui/`나 `hooks/`로 옮깁니다.

## 전시 정보 수정 위치

팀명·프로젝트명·팀원·스튜디오는 **`src/data/projects.ts`의 `PROJECTS` 한 곳에서 수정**합니다.
`title`에는 서비스명만, `description`에는 한 줄 소개를 저장합니다. 서비스명 자체에 포함된 콜론(`Re:Mind`, `SAFE:ON`)은 유지합니다.
제공된 프로젝트명과 팀원 순서를 그대로 저장하며, 배열은 스튜디오 6 → 5 → 4 → 3 → 2 → 1 → 10과 각 스튜디오의 팀 순서로 배치했습니다.
`project-1`부터 `project-12`까지의 ID는 처음 전달받은 팀 목록 순서에 대응하므로 화면 순서를 바꿔도 변경하지 않습니다.

- 프로젝트 목록·상세·부스 목록·함께 전시되는 프로젝트가 같은 원본을 참조합니다.
- `src/data/participants.ts`는 프로젝트별 팀원을 펼쳐서 참여자 목록을 만듭니다. 참여자 이름·팀·스튜디오를 별도로 작성하지 않습니다.
- 참여자 초성 필터도 실제 명단에 쓰이는 초성만 자동으로 생성합니다.
- 방명록의 `GUESTBOOK_TEAMS`는 원본의 팀명에서 생성하며 ‘모두에게’만 추가합니다. 프로젝트 상세의 응원 링크도 같은 팀으로 연결됩니다.

동일한 이름이 여러 팀에 있을 때는 팀별 참여 기록을 유지하고, 참여자 상세에 팀명을 표시합니다.
프로젝트명·한 줄 소개·상세 소개·시연 기능·팀원 역할은 팀별 제출 설문 자료를 반영했습니다.
프로젝트·팀 이미지는 `src/assets/team/`의 `팀명_project.*`, `팀명_team.*` 파일을 `projects.ts`에서 직접 연결합니다.
서비스 및 GitHub 링크는 제출한 팀에만 `serviceUrl`, `githubUrl`로 저장해 프로젝트 상세에서 표시합니다. 이메일 등 제출자 연락처는 공개 데이터에 포함하지 않습니다.
졸준위 직책과 끝나지 않은 이야기의 콘텐츠는 프로젝트 소속과 별도인 자료이므로 각각의 기존 페이지 데이터에서 관리합니다.

## 공통 UI

- `Button`, `IconButton`, `FloatingActionButton`: 일반 버튼, 아이콘 버튼, 프레임 우하단 플로팅 버튼.
- `GlassLink`: 내부 경로와 외부 URL에 사용하는 캡슐 링크.
- `ContentSection`: 작은 제목과 본문을 가진 전시·프로젝트 안내 섹션.
- `FilterBar`: 참여자 초성 필터와 방명록 가로 스크롤 필터.
- `Modal`, `Drawer`: 동일한 모바일 프레임 안에서 열리는 상세 모달과 메뉴.
- `Tooltip`: 닫기 버튼이 있는 안내 말풍선. `tail`은 꼬리가 붙는 면(`top`, `bottom`, `left`, `right`), `color`는 `navy` 또는 `pink`이며 기본값은 `bottom`·`navy`입니다. 표시 여부와 위치는 사용하는 화면에서 관리합니다.

`tailOffset`으로 꼬리의 위치를 조정할 수 있습니다. 위·아래 꼬리는 왼쪽 기준, 좌·우 꼬리는 위쪽 기준이며 기본값은 중앙입니다.

```tsx
{isTooltipOpen && (
  <Tooltip tail="bottom" color="navy" onClose={() => setIsTooltipOpen(false)}>
    스튜디오를 선택해주세요
  </Tooltip>
)}
```

`useModalDialog`는 네이티브 dialog 열기·닫기와 스크롤 잠금을 담당합니다.
`useDetailModal`은 상세 대상과 열림 상태를 함께 관리하며, 닫힘 애니메이션 동안 선택 데이터를 유지합니다.

## API와 데이터

방명록은 `https://feetfit-love.store`의 `GET /api/guestbooks`로 조회하고 `POST /api/guestbooks`로 등록합니다.
기존 React 상태와 네이티브 `fetch`를 사용하며 상태 관리·HTTP 라이브러리를 추가하지 않았습니다.

| 위치 | 역할 |
| --- | --- |
| `api/client.ts` | 요청 URL, 공통 응답의 `result` 추출, HTTP·업무 오류 처리 |
| `api/guestbook.ts` | 방명록 조회·등록과 응답 필드 검사 |
| `types/api.ts`, `types/guestbook.ts` | 공통 응답과 방명록 데이터 타입 |
| `pages/guestbook/hooks/useGuestbooks.ts` | 조회 상태, 재시도, 등록 후 재조회, 페이지를 떠날 때 조회 취소 |
| `data/projects.ts` | 팀명·프로젝트명·팀원·스튜디오 단일 원본 |
| `pages/guestbook/constants.ts` | 원본에서 파생한 작성 대상과 입력 길이 제한 |
| `pages/guestbook/utils.ts` | 팀 목록, 필터, 기존 프로젝트 링크 처리 |

화면은 로딩·실패·빈 목록을 구분하고 실패 시 다시 시도할 수 있습니다.
조회 결과의 순서와 `id`, `teamId`, `writer`, `content`, `createdAt`을 그대로 유지합니다.
명세에 날짜의 형식만 있고 파라미터 이름·필수 여부가 없어 날짜 조건은 보내지 않습니다.

작성 시 `teamId`, `writer`, `content`를 JSON으로 보내며 작성자·내용의 앞뒤 공백을 제거합니다.
저장 중에는 입력과 중복 제출을 막습니다. 등록 성공 시 작성창을 닫고 해당 팀을 선택한 뒤 목록을 다시 조회합니다.
실패 시 입력을 유지하고 서버 오류 메시지를 표시합니다. `GUESTBOOK4001`처럼 `result`가 없는 오류 응답도 처리합니다.
등록 성공 후 목록 조회만 실패하면 목록의 ‘다시 시도’로 GET만 재요청합니다.

작성 대상은 ‘모두에게’와 `data/projects.ts`에서 가져온 팀명입니다. `pages/guestbook/constants.ts`의 `GUESTBOOK_TEAMS`로 변환하며,
아직 방명록이 없는 팀도 목록 필터와 작성 선택지에 표시합니다. 대소문자와 특수문자를 그대로 전송합니다.
‘모두에게’를 선택하면 `teamId: "모두에게"`로 전송합니다. ‘전체’는 조회 필터로만 유지합니다.
작성 선택지와 팀 필터는 ‘모두에게 → 한글 → 숫자 → 영어’ 순으로 정렬하며, 그 외 이름은 마지막에 표시합니다.

### API 주소 설정

기본 요청 주소는 같은 출처의 `/api`입니다. 별도 환경변수 설정 없이 실행할 수 있습니다.
`vite.config.ts`의 프록시가 개발·미리보기 요청을 전달하고, `vercel.json`의 첫 번째 rewrite가 배포 환경 요청을 전달합니다.
백엔드에 브라우저 CORS 허용 헤더가 없어도 이 경로로 조회할 수 있습니다.
백엔드 도메인을 바꾸면 두 설정의 대상 주소를 함께 수정합니다.

백엔드가 CORS를 허용할 때만 `.env.example`을 참고해 `.env.local`에 `VITE_API_BASE_URL`을 지정하면 직접 호출할 수 있습니다.
기존 `.env.local`을 덮어쓰지 말고 필요한 항목만 추가합니다. 환경변수 변경 후 개발 서버를 재시작하고, 배포 시에는 다시 빌드합니다.
`VITE_` 변수는 브라우저 번들에 포함되므로 비밀 값을 넣지 않습니다.

### 아직 명세가 필요한 부분

- 팀 목록 API는 미제공이므로 서버에 등록된 이름이 바뀌면 `data/projects.ts`의 팀명을 수정해야 합니다. 조회 응답에 다른 팀이 있으면 조회 필터에만 추가하고 작성 선택지에는 추가하지 않습니다.
- 기존 ‘모두에게’ 조회 필터는 정확히 `teamId: "모두에게"`인 글만 표시하며, 빈 문자열은 ‘수신 팀 미지정’으로 따로 표시합니다.
- `?teamId=팀명`과 기존 `?projectId=project-1` 링크는 해당 팀의 빈 목록도 보여줍니다. 링크의 팀이 ‘모두에게’ 또는 등록 가능한 12개 팀에 해당하지 않으면 작성창에서 대상을 다시 선택해야 합니다.
- 프로젝트·참여자 API는 미제공이므로 전달받은 정보를 `data/projects.ts`에서 관리합니다. 이야기 콘텐츠는 별도 목업이며 API 명세를 받으면 연결합니다.

새 API는 `api/`에 요청 함수, `types/`에 응답 타입을 추가하고 필요한 화면의 훅에서 호출합니다.
페이지와 표시용 컴포넌트에는 요청 코드를 넣지 않습니다.

참가자 모달의 소감 링크는 라우터 state의 `storyParticipantId`로 해당 이야기 상세를 바로 엽니다.
이야기 목업은 `PARTICIPANTS`에서 파생하며, 동명이인도 이름 대신 `participantId`로 구분합니다. 실제 소감 제출 전에는 준비 중 문구를 표시합니다.

부스 배치도 좌표는 `pages/booths/data/floorPlan.ts`에서 수정합니다.
기준 비율 `357 / 557`과 퍼센트 좌표를 유지하며, 도형과 라벨을 DOM으로 배치합니다.

홈·메뉴의 부스배치도 링크는 라우터 state의 `boothGuide`로 스튜디오 5 가이드를 표시합니다.
참여자 상세의 부스 위치 링크는 `boothProjectId`를 전달하며, `PROJECTS`에서 해당 프로젝트명을 가져와 선택된 스튜디오 옆에 표시합니다.
프로젝트명 안내로 진입할 때는 배치도를 유지하고, 스튜디오를 클릭하면 기존처럼 해당 목록으로 이동합니다.
툴팁 위치는 `pages/booths/components/BoothFloorPlanTooltip.tsx`에서 관리하며 배치도 좌표를 참조합니다.
5·6번은 아래, 3·4·2·1번은 왼쪽, 10번은 오른쪽에 두고 꼬리 끝과 스튜디오 사이에 약 8px을 남깁니다.
홈·메뉴 진입 가이드는 일반 굵기의 한 줄로 표시하며, 다른 스튜디오와 겹치는 것을 허용합니다. 프로젝트명 안내는 굵게 표시하고 스튜디오와 겹치지 않도록 배치합니다.

## 스타일

색상은 `index.css`의 Tailwind `@theme` 토큰을 사용합니다.
예: `text-ink`, `text-muted`, `text-on-dark`, `bg-page`, `bg-navy`, `bg-pink`.
타이포그래피 이름과 수치는 [스타일 가이드](src/styles/README.md)를 참고합니다.

`pt-navbar`는 내비게이션 아래 기본 24px 여백을 포함한 상단 패딩입니다.
다른 간격이 필요한 화면은 `pt-navbar [--page-gap:43px]`처럼 해당 페이지에서 지정합니다.
`glass-effect`에 `glass-dark` 또는 `glass-light`를 조합해 반복되는 글래스 색상을 적용할 수 있습니다.
배치도처럼 동적인 퍼센트 좌표가 필요한 경우에는 `style`을 사용합니다.

홈·참여자·방명록·끝나지 않은 이야기의 배경은 `styles/utilities/background.css`에서 관리합니다.
스크롤 영역 바깥의 `.app-frame`에 `#0E2540`과 `optimized/poster-background.webp`를 `100% auto` 크기로 적용해 이미지를 고정합니다.
모바일 스크롤 경계의 바탕색도 남색으로 맞추며, 전시소개는 이미지 없이 기존 단색 배경을 사용합니다.

## 이미지 관리

`src/assets/`의 원본은 보관하고, 화면에서는 `src/assets/optimized/`의 WebP 파일을 사용합니다.
프로젝트 목록은 480px 썸네일, 상세·참여자 모달은 최대 1200px 이미지, 팀 사진은 최대 480px 이미지를 사용합니다.
데스크톱 배경은 최대 2560px이며, 포스터와 모바일 배경은 원본 해상도를 유지합니다. 장소 이미지는 움직임과 재생 시간을 유지한 animated WebP입니다.

원본 교체 후 Python과 [Pillow](https://pillow.readthedocs.io/en/stable/handbook/image-file-formats.html#webp)가 설치된 환경에서 `python scripts/optimize-images.py`를 실행하고 경량본도 함께 커밋합니다.
스크립트는 출력 파일의 디코딩·크기·프레임 수·재생 시간을 검사합니다. 새 팀을 추가하면 `data/projects.ts`에서 `image`, `thumbnail`, `teamImage`를 연결합니다.
일반 개발·배포 빌드에는 Python이 필요하지 않습니다. 원본 파일은 앱에서 참조하지 않으므로 Vite 배포 결과에 포함되지 않습니다.

## 브라우저 확인

`scripts/check-guestbook-dropdown.mjs`는 API 응답을 가로채 성공·로딩·빈 목록·오류·재시도·취소와 팀 필터를 확인합니다.
팀 선택, 스크롤과 밑줄 위치, POST 요청 본문, 중복 제출 방지, 등록 성공·실패와 입력 보존도 검사합니다.
GET·POST를 모두 가로채므로 실제 서버에 테스트 글을 등록하지 않습니다.
Node 22 이상, 실행 중인 Vite 서버와 테스트용 Chrome의 CDP 엔드포인트가 필요합니다.

```sh
node scripts/check-guestbook-dropdown.mjs http://127.0.0.1:5178 http://127.0.0.1:9228
```

검사 스크립트는 연결된 브라우저 페이지를 방명록으로 이동시킵니다.

`node scripts/check-story-links.mjs`는 같은 Vite·Chrome 환경에서 참가자별 소감 연결, 동명이인 구분, 20px 간격과 글자 스타일, 상세 열기·닫기를 검사합니다.

`node scripts/check-booth-tooltips.mjs`는 동일한 Vite·Chrome 환경에서 홈·메뉴·참여자 상세 진입과 12개 프로젝트 안내를 검사합니다.
320px·390px·데스크톱 화면에서 스튜디오와 툴팁의 겹침, 꼬리 방향과 간격, 닫기, 목록 스크롤을 확인합니다.
