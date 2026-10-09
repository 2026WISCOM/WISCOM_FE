import { useEffect, useState } from "react";

export const STORIES_RELEASE_AT = "2026-10-29T10:00:00+09:00";
const RELEASE_TIME = Date.parse(STORIES_RELEASE_AT);

export function useStoriesReleased() {
  const [isReleased, setIsReleased] = useState(() => Date.now() >= RELEASE_TIME);

  useEffect(() => {
    if (isReleased) return;
    let timer: number;

    function checkRelease() {
      window.clearTimeout(timer);
      const remaining = RELEASE_TIME - Date.now();
      if (remaining <= 0) {
        setIsReleased(true);
        return;
      }
      // Recheck daily to stay below the browser's maximum timeout delay.
      timer = window.setTimeout(checkRelease, Math.min(remaining, 86_400_000));
    }

    checkRelease();
    document.addEventListener("visibilitychange", checkRelease);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", checkRelease);
    };
  }, [isReleased]);

  return isReleased;
}
