import { useId, useState } from "react";
import type { Participant } from "../types/participant";
import ParticipantDetailModal from "./participants/components/ParticipantDetailModal";
import ParticipantFilters from "./participants/components/ParticipantFilters";
import ParticipantItem from "./participants/components/ParticipantItem";
import { ALL_PARTICIPANTS_FILTER } from "./participants/constants";
import type { ParticipantFilter } from "./participants/constants";
import { MOCK_PARTICIPANTS } from "./participants/data/mockParticipants";
import { filterParticipants } from "./participants/utils/filterParticipants";

export default function ParticipantsPage() {
	const resultsId = useId();
	const detailId = useId();
	const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	function openParticipant(participant: Participant) {
		setSelectedParticipant(participant);
		setIsDetailOpen(true);
	}
	const [selectedFilter, setSelectedFilter] = useState<ParticipantFilter>(
		ALL_PARTICIPANTS_FILTER,
	);
	const participants = filterParticipants(MOCK_PARTICIPANTS, selectedFilter);

	return (
		<section className="dark-gradient-background min-h-full pt-28 pb-12">
			<h1 className="sr-only">참가자 목록</h1>
			<ParticipantFilters
				selectedFilter={selectedFilter}
				onSelect={setSelectedFilter}
				resultsId={resultsId}
			/>
			<p role="status" className="sr-only">
				{participants.length}명의 참가자
			</p>
			<ul
				id={resultsId}
				aria-label="참가자"
				className="mt-6 grid grid-cols-4 gap-y-7 px-[30px]"
			>
				{participants.map((participant) => (
					<ParticipantItem
						key={participant.id}
						participant={participant}
						onSelect={openParticipant}
						dialogId={detailId}
					/>
				))}
			</ul>
			<ParticipantDetailModal
				id={detailId}
				participant={selectedParticipant}
				isOpen={isDetailOpen}
				onClose={() => setIsDetailOpen(false)}
			/>
		</section>
	);
}
