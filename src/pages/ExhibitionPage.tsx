import posterImage from "../assets/optimized/poster.webp";
import ContentSection from "../components/ui/ContentSection";

const EXHIBITION_DAYS = [
	{ label: "DAY 1", schedule: "2026. 10. 29. (목) 10:00~17:30" },
	{ label: "DAY 2", schedule: "2026. 10. 30. (금) 09:30~16:30" },
] as const;

const COMMITTEE = [
	{ role: "위원장", names: "황민지" },
	{ role: "부위원장", names: "이채은" },
	{ role: "기획&디자인", names: "이채은 장은선 황민지" },
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

고요한 수면 아래에도 끊임없이 물결이 흐르듯, 우리가 함께한 시간에도 수많은 순간이 이어져 왔습니다. 모든 것이 낯설기만 했던 시작부터 함께 웃고 고민하며 답을 찾아가던 날들까지, 
우리는 저마다의 자리에서 조금씩 앞으로 나아왔습니다.

그렇게 걸어온 시간이 오늘, WISCOM이라는 하나의 바다에 모였습니다. 이곳에 펼쳐진 작품들은 우리가 지나온 시간을 각자의 방식으로 보여주는 결과입니다. 하나의 작품이 완성되기까지 이어진 수많은 시도와 선택은 눈앞의 결과만으로는 모두 알 수 없지만, 바로 그 과정이 있었기에 지금의 작품과 우리가 존재합니다.

Beneath the Surface.
보이는 것 너머에 존재하는 이야기를 바라본다는 이번 전시의 주제는, 어쩌면 지금의 우리와 가장 닮아 있습니다. 각기 다른 모습으로 이곳에 도착했지만, 그 아래에는 저마다 치열하게 지나온 시간이 있습니다. 이번 전시가 완성된 작품뿐만아니라 그곳에 이르기까지의 여정까지 함께 바라볼 수 있는 자리가 되기를 바랍니다.

이제 우리는 하나의 바다에서 보낸 시간을 뒤로하고 각자의 방향으로 나아갑니다.앞으로 새로운 물결을 만나고 때로는 거센 파도 앞에 서게 되더라도, 이곳까지 스스로 걸어온 경험과 곁에서 함께했던 사람들이 다시 앞으로 나아갈 힘이 되어주기를 바랍니다.

졸업은 우리가 함께 써 내려온 한 장을 마무리하는 순간이자, 각자의 이야기를 새롭게 이어가는 출발점입니다. 언젠가 서로 다른 바다를 항해하다 오늘을 돌아보았을 때, 이 순간이 우리가 얼마나 멀리 걸어왔는지를 떠올리게 하는 따뜻한 기억으로 남아 있기를 바랍니다.

함께 지나온 모든 물결을 기억하며,

이제 우리 앞에 펼쳐질 새로운 바다를 향해.

컴퓨터공학전공 제36회 졸업전시준비위원회 일동`}
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
