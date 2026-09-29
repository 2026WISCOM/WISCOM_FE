import type { Participant } from "../../../types/participant";
import { ALL_PARTICIPANTS_FILTER } from "../constants";
import type { ParticipantFilter } from "../constants";

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const SYLLABLES_PER_INITIAL = 588;
const HANGUL_INITIALS = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
] as const;

export function filterParticipants(
  participants: readonly Participant[],
  selectedFilter: ParticipantFilter,
) {
  if (selectedFilter === ALL_PARTICIPANTS_FILTER) return participants;

  return participants.filter(({ name }) => {
    const firstCharacter = name.trim().normalize("NFC").charCodeAt(0);
    if (firstCharacter < HANGUL_START || firstCharacter > HANGUL_END) return false;

    const initialIndex = Math.floor((firstCharacter - HANGUL_START) / SYLLABLES_PER_INITIAL);
    return HANGUL_INITIALS[initialIndex] === selectedFilter;
  });
}
