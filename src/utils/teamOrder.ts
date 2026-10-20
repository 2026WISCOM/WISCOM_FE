function getTeamNameGroup(name: string, englishBeforeNumbers: boolean) {
  if (name === "모두에게") return 0;
  if (/^[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(name)) return 1;
  if (/^[0-9]/.test(name)) return englishBeforeNumbers ? 3 : 2;
  if (/^[a-z]/i.test(name)) return englishBeforeNumbers ? 2 : 3;
  return 4;
}

export function compareTeamNames(first: string, second: string, { englishBeforeNumbers = false, numeric = true } = {}) {
  return getTeamNameGroup(first, englishBeforeNumbers) - getTeamNameGroup(second, englishBeforeNumbers)
    || first.localeCompare(second, "ko", { numeric, sensitivity: "base" });
}
