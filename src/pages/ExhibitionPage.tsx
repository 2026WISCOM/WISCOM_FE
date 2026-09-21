const EXHIBITION_DAYS = ["DAY 1", "DAY 2"] as const;

const COMMITTEE = [
  { role: "위원장", names: "황민지" },
  { role: "부위원장", names: "이채은" },
  { role: "기획", names: "이채은 황민지" },
  { role: "디자인", names: "장은선" },
  { role: "웹사이트", names: "김미주 김은서 이채은 황민지" },
] as const;

export default function ExhibitionPage() {
  return (
    <section className="flex flex-col gap-[30px] bg-[#0e2540] px-5 pt-[calc(max(1rem,env(safe-area-inset-top))+4rem+24px)] pb-16 text-[#f0f0f0]">
      <h1 className="sr-only">전시 소개</h1>

      {/* 실제 전시 포스터가 준비되면 이미지로 교체합니다. */}
      <div
        role="img"
        aria-label="전시 포스터 준비 중"
        className="body-small flex h-[500px] w-full shrink-0 items-center justify-center bg-white/10"
      >
        포스터 이미지
      </div>

      <ul aria-label="전시 일정" className="flex flex-col gap-1.5">
        {EXHIBITION_DAYS.map((day) => (
          <li key={day} className="flex items-center gap-3.5">
            <span className="body-xsmall shrink-0 rounded-full bg-[#ef79a8] px-4 py-0.5 text-[#0c1938]">
              {day}
            </span>
            <p className="body-medium">날짜 및 시간 추후 안내</p>
          </li>
        ))}
      </ul>

      <p className="body-small break-keep">
        전시회 컨셉 소개 문구가 들어갈 자리입니다.
      </p>

      <section aria-labelledby="committee-heading" className="flex flex-col gap-3.5">
        <h2 id="committee-heading" className="heading-small">졸업전시준비위원회</h2>
        <ul className="body-small flex flex-col gap-1.5 break-keep">
          {COMMITTEE.map(({ role, names }) => (
            <li key={role}>
              <strong className="font-bold">{role}</strong>{" "}{names}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
