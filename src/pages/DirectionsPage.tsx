const MAP_QUERY = encodeURIComponent("서울시 도봉구 마들로13길 84 지하 1층 (서울창업허브 창동)");
const MAP_SERVICES = [
  { name: "카카오맵", href: `https://map.kakao.com/link/search/${MAP_QUERY}` },
  { name: "네이버지도", href: `https://map.naver.com/p/search/${MAP_QUERY}` },
] as const;
const TRANSIT_TYPES = ["버스", "지하철"] as const;
const PARKING_NOTICES = [
  "건물 지하 주차장 이용 가능",
  "주차비 30분 무료, 이후 10분당 500원",
  "1일 최대 1만 원 부과",
  "만차 시 창동 공영 주차장 이용 권장",
] as const;

export default function DirectionsPage() {
  return (
    <section className="bg-white px-5 pt-[calc(max(1rem,env(safe-area-inset-top))+4rem+24px)] pb-16 text-[#172a3a]">
      <header className="flex flex-col gap-1">
        <h1 className="heading-large">서울창업허브 창동</h1>
        <p className="body-medium break-keep">서울시 도봉구 마들로13길 84 지하 1층</p>
      </header>

      <div className="mt-[17px] overflow-hidden rounded-lg">
        {/* 실제 장소 사진과 로고가 준비되면 이미지로 교체합니다. */}
        <div
          role="img"
          aria-label="서울창업허브 창동 장소 이미지 준비 중"
          className="body-small flex h-[240px] items-center justify-center bg-[#dce3e9]"
        >
          장소 이미지
        </div>
        <div className="flex h-11 items-center justify-center bg-[#ededed]">
          <div
            role="img"
            aria-label="서울창업허브 창동 로고 준비 중"
            className="body-xsmall flex h-[25px] w-[100px] items-center justify-center bg-white"
          >
            로고
          </div>
        </div>
      </div>

      <div
        aria-label="지도 서비스"
        className="mt-[23px] grid grid-cols-2 gap-[11px] [--glass-background:#264565] [--glass-fallback-background:#264565] [--glass-solid-background:#264565]"
      >
        {MAP_SERVICES.map(({ name, href }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name}에서 서울창업허브 창동 검색 (새 탭)`}
            className="glass-effect body-large flex h-[58px] items-center justify-center rounded-full px-3 text-center text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy active:brightness-95 motion-reduce:transition-none"
          >
            {name}
          </a>
        ))}
      </div>

      <ul aria-label="대중교통 안내" className="mt-[19px] flex flex-col gap-3 text-[#264565]">
        {TRANSIT_TYPES.map((type) => (
          <li key={type} className="flex items-start gap-3">
            <span className="body-xsmall shrink-0 rounded-full border border-current px-[21px] py-0.5">
              {type}
            </span>
            <p className="body-medium break-keep">노선 정보 추후 안내</p>
          </li>
        ))}
      </ul>

      <section aria-labelledby="parking-heading" className="mt-[45px] flex flex-col gap-3.5">
        <h2 id="parking-heading" className="heading-small">주차 안내</h2>
        <ul className="body-small flex list-disc flex-col gap-1.5 pl-5 break-keep">
          {PARKING_NOTICES.map((notice) => (
            <li key={notice}>{notice}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}
