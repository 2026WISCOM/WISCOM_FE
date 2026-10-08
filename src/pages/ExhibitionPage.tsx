import posterImage from "../assets/optimized/poster.webp";
import ContentSection from "../components/ui/ContentSection";

const EXHIBITION_DAYS = [
	{ label: "DAY 1", schedule: "2026. 10. 29. (목) 10:00~18:00" },
	{ label: "DAY 2", schedule: "2026. 10. 30. (금) 09:30~17:30" },
] as const;

const COMMITTEE = [
	{ role: "위원장", names: "황민지" },
	{ role: "부위원장", names: "이채은" },
	{ role: "기획&디자인", names: "이채은 황민지 장은선" },
	{ role: "웹사이트", names: "김미주 김은서" },
] as const;

export default function ExhibitionPage() {
	return (
		<section className="flex flex-col gap-[30px] bg-deep-navy px-5 pt-navbar pb-footer text-on-dark">
			<h1 className="sr-only">전시 소개</h1>

			<img
				src={posterImage}
				width={1442}
				height={2007}
				fetchPriority="high"
				alt="2026 WISCOM 졸업 전시 포스터"
				className="h-auto w-full shrink-0"
			/>

			<ul aria-label="전시 일정" className="flex flex-col gap-1.5">
				{EXHIBITION_DAYS.map(({ label, schedule }) => (
					<li key={label} className="flex items-center gap-3.5">
						<span className="body-xsmall shrink-0 rounded-full bg-pink px-4 py-0.5 text-[#0c1938]">
							{label}
						</span>
						<p className="body-medium">{schedule}</p>
					</li>
				))}
			</ul>

			<p className="body-small whitespace-pre-line break-keep">
				{`바다는 수면 위의 모습만으로는 그 깊이를 알 수 없습니다.
고요한 수면 아래에도 수많은 물결이 흐르듯, 우리가 함께한 시간 속에도 겉으로는 다 보이지 않는 수많은 이야기가 쌓여 있습니다. 낯설기만 했던 시작부터 함께 웃고 고민하며 답을 찾아가던 날들까지, 그렇게 쌓인 순간들이 지금의 우리를 만들었습니다.

긴 시간의 끝에서 우리는 WISCOM이라는 하나의 바다에서 다시 만났습니다. 이곳에 펼쳐진 작품 하나하나에는 완성된 결과 너머, 쉽게 드러나지 않았던 고민과 시행착오, 그리고 포기하지 않고 이어온 시간이 담겨 있습니다.

Beneath the Surface.
보이는 것보다 더 깊은 곳에 우리가 지나온 시간이 있고, 그 모든 순간이 있었기에
우리는 지금 이곳에 도착할 수 있었습니다.

이제 우리는 함께한 바다를 지나 각자의 방향으로 나아갑니다. 앞으로 새로운 물결과 때로는 거센 파도를 마주하더라도, 여기까지 함께 지나온 시간이 다시 한 걸음을 내디딜 힘이 되어주기를 바랍니다. 졸업은 우리 이야기의 끝이 아니라, 각자의 이야기가 더 넓은 곳으로 이어지는 새로운 시작일 것입니다.

함께 지나온 모든 물결과 그 아래 쌓인 시간을 오래도록 기억하기를 바랍니다. 그리고 언젠가 각자의 바다를 항해하다 오늘을 돌아보았을 때, 이 순간이 새로운 시작을 향해 나아갔던 우리의 빛나는 기억으로 남아 있기를 바랍니다.

함께 지나온 모든 물결을 기억하며,
이제 우리 앞에 펼쳐질 새로운 바다를 향해.`}
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
