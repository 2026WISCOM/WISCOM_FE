import type { Participant } from "../../../types/participant";
import { ALL_PARTICIPANTS_FILTER } from "../constants";
import type { ParticipantFilter } from "../constants";
import { getNameInitial } from "./getNameInitial";

export function filterParticipants(
  participants: readonly Participant[],
  selectedFilter: ParticipantFilter,
) {
  if (selectedFilter === ALL_PARTICIPANTS_FILTER) return participants;

  return participants.filter(({ name }) => getNameInitial(name) === selectedFilter);
}
