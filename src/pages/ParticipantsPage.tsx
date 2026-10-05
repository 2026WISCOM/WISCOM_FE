import { useId, useState } from "react";
import { PARTICIPANTS } from "../data/participants";
import { useDetailModal } from "../hooks/useDetailModal";
import type { Participant } from "../types/participant";
import ParticipantDetailModal from "./participants/components/ParticipantDetailModal";
import ParticipantFilters from "./participants/components/ParticipantFilters";
import ParticipantItem from "./participants/components/ParticipantItem";
import { ALL_PARTICIPANTS_FILTER } from "./participants/constants";
import type { ParticipantFilter } from "./participants/constants";
import { filterParticipants } from "./participants/utils/filterParticipants";

export default function ParticipantsPage() {
	const resultsId = useId();
	const detailId = useId();
	const {
		selectedItem: selectedParticipant,
		isOpen: isDetailOpen,
		open: openParticipant,
		close: closeParticipant,
	} = useDetailModal<Participant>();
	const [selectedFilter, setSelectedFilter] = useState<ParticipantFilter>(
		ALL_PARTICIPANTS_FILTER,
	);
	const participants = filterParticipants(PARTICIPANTS, selectedFilter);

	return (
		<section className="pt-navbar pb-footer">
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
						showTeamName={PARTICIPANTS.some(
							(other) => other.id !== participant.id && other.name === participant.name,
						)}
						onSelect={openParticipant}
						dialogId={detailId}
					/>
				))}
			</ul>
			<ParticipantDetailModal
				id={detailId}
				participant={selectedParticipant}
				isOpen={isDetailOpen}
				onClose={closeParticipant}
			/>
		</section>
	);
}
