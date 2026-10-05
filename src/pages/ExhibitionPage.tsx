import posterImage from "../assets/poster.png";
import ContentSection from "../components/ui/ContentSection";

const EXHIBITION_DAYS = ["DAY 1", "DAY 2"] as const;

const COMMITTEE = [
	{ role: "위원장", names: "황민지" },
	{ role: "부위원장", names: "이채은" },
	{ role: "기획", names: "이채은 황민지" },
	{ role: "디자인", names: "장은선" },
	{ role: "웹사이트", names: "김미주 김은서" },
] as const;

export default function ExhibitionPage() {
	return (
		<section className="flex flex-col gap-[30px] bg-deep-navy px-5 pt-navbar pb-footer text-on-dark">
			<h1 className="sr-only">전시 소개</h1>

			<img
				src={posterImage}
				alt="2026 WISCOM 졸업 전시 포스터"
				className="h-auto w-full shrink-0"
			/>

			<ul aria-label="전시 일정" className="flex flex-col gap-1.5">
				{EXHIBITION_DAYS.map((day) => (
					<li key={day} className="flex items-center gap-3.5">
						<span className="body-xsmall shrink-0 rounded-full bg-pink px-4 py-0.5 text-[#0c1938]">
							{day}
						</span>
						<p className="body-medium">날짜 및 시간 추후 안내</p>
					</li>
				))}
			</ul>

			<p className="body-small break-keep">
				전시회 컨셉 소개 문구가 들어갈 자리입니다.
			</p>

			<ContentSection
				headingId="committee-heading"
				title="졸업전시준비위원회"
			>
				<ul className="body-small flex flex-col gap-1.5 break-keep">
					{COMMITTEE.map(({ role, names }) => (
						<li key={role}>
							<strong className="font-bold">{role}</strong>{" "}
							{names}
						</li>
					))}
				</ul>
			</ContentSection>
		</section>
	);
}
