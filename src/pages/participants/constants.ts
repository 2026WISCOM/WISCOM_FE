import { PARTICIPANTS } from "../../data/participants";
import { getNameInitial, HANGUL_INITIALS } from "./utils/getNameInitial";

export const ALL_PARTICIPANTS_FILTER = "전체";

const participantInitials = new Set(PARTICIPANTS.map(({ name }) => getNameInitial(name)));

export const PARTICIPANT_FILTERS = [
  ALL_PARTICIPANTS_FILTER,
  ...HANGUL_INITIALS.filter((initial) => participantInitials.has(initial)),
] as const;

export type ParticipantFilter = (typeof PARTICIPANT_FILTERS)[number];
