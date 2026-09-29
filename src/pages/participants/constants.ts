export const ALL_PARTICIPANTS_FILTER = "전체";

export const PARTICIPANT_FILTERS = [
  ALL_PARTICIPANTS_FILTER, "ㄱ", "ㄴ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅍ", "ㅎ",
] as const;

export type ParticipantFilter = (typeof PARTICIPANT_FILTERS)[number];
