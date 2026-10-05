import buildingEntranceImage from "../assets/building-entrance.gif";
import ContentSection from "../components/ui/ContentSection";
import GlassLink from "../components/ui/GlassLink";

const MAP_QUERY = encodeURIComponent(
	"서울시 도봉구 마들로13길 84 지하 1층 (서울창업허브 창동)",
);
const MAP_SERVICES = [
	{
		name: "카카오맵",
		href: `https://map.kakao.com/link/search/${MAP_QUERY}`,
	},
	{ name: "네이버지도", href: `https://map.naver.com/p/search/${MAP_QUERY}` },
] as const;
const TRANSIT_ROUTES = [
	{ type: "버스", description: "1119, 노원15, 도봉01, 도봉08, 도봉09" },
	{ type: "지하철", description: "1, 4호선 창동역 5번 출구" },
] as const;
const PARKING_NOTICES = [
	"건물 지하 주차장 이용 가능",
	"주차비 30분 무료, 이후 10분당 500원",
	"1일 최대 1만 원 부과",
	"만차 시 창동 공영 주차장 이용 권장",
] as const;

export default function DirectionsPage() {
	return (
		<section className="bg-page px-5 pt-navbar pb-footer text-ink">
			<header className="flex flex-col gap-1">
				<h1 className="heading-large">서울창업허브 창동</h1>
				<p className="body-medium break-keep">
					서울시 도봉구 마들로13길 84 지하 1층
				</p>
			</header>

			<img
				src={buildingEntranceImage}
				alt="서울창업허브 창동 건물 입구"
				className="mt-[17px] h-[284px] w-full rounded-lg object-cover"
			/>

			<div
				aria-label="지도 서비스"
				className="mt-[23px] grid grid-cols-2 gap-[11px] [--glass-background:var(--color-navy)] [--glass-fallback-background:var(--color-navy)] [--glass-solid-background:var(--color-navy)]"
			>
				{MAP_SERVICES.map(({ name, href }) => (
					<GlassLink
						key={name}
						to={href}
						target="_blank"
						rel="noopener noreferrer"
						focusColor="navy"
						aria-label={`${name}에서 서울창업허브 창동 검색 (새 탭)`}
						className="body-large text-white"
					>
						{name}
					</GlassLink>
				))}
			</div>

			<ul
				aria-label="대중교통 안내"
				className="mt-[19px] flex flex-col gap-3 text-navy"
			>
				{TRANSIT_ROUTES.map(({ type, description }) => (
					<li key={type} className="flex items-start gap-3">
						<span className="body-xsmall shrink-0 rounded-full border border-current px-[21px] py-0.5">
							{type}
						</span>
						<p className="body-medium break-keep">
							{description}
						</p>
					</li>
				))}
			</ul>

			<ContentSection
				headingId="parking-heading"
				title="주차 안내"
				className="mt-[45px]"
			>
				<ul className="body-small flex list-disc flex-col gap-1.5 pl-5 break-keep">
					{PARKING_NOTICES.map((notice) => (
						<li key={notice}>{notice}</li>
					))}
				</ul>
			</ContentSection>
		</section>
	);
}
