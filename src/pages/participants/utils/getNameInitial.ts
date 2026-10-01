const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const SYLLABLES_PER_INITIAL = 588;

export const HANGUL_INITIALS = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
] as const;

export function getNameInitial(name: string) {
  const firstCharacter = name.trim().normalize("NFC").charCodeAt(0);
  if (!(firstCharacter >= HANGUL_START && firstCharacter <= HANGUL_END)) return undefined;

  const initialIndex = Math.floor((firstCharacter - HANGUL_START) / SYLLABLES_PER_INITIAL);
  return HANGUL_INITIALS[initialIndex];
}
