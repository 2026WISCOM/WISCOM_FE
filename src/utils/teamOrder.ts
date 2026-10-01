function getTeamNameGroup(name: string) {
  if (name === "모두에게") return 0;
  if (/^[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(name)) return 1;
  if (/^[0-9]/.test(name)) return 2;
  if (/^[a-z]/i.test(name)) return 3;
  return 4;
}

export function compareTeamNames(first: string, second: string) {
  return getTeamNameGroup(first) - getTeamNameGroup(second)
    || first.localeCompare(second, "ko", { numeric: true, sensitivity: "base" });
}
