import { useLayoutEffect, useRef, useState } from "react";

export function useFilterIndicator(selectedFilter: string) {
  const trackRef = useRef<HTMLDivElement>(null);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const button = selectedButtonRef.current;
    if (!track || !button) return;

    function updateIndicator() {
      if (!track || !button) return;
      const trackBounds = track.getBoundingClientRect();
      const buttonBounds = button.getBoundingClientRect();
      const left = buttonBounds.left - trackBounds.left;
      const width = buttonBounds.width;

      setIndicator((previous) =>
        previous?.left === left && previous.width === width ? previous : { left, width },
      );
    }

    updateIndicator();
    const observer = new ResizeObserver(updateIndicator);
    observer.observe(track);
    observer.observe(button);

    return () => observer.disconnect();
  }, [selectedFilter]);

  return { trackRef, selectedButtonRef, indicator };
}
