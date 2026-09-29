import { useEffect } from "react";
import { useFilterIndicator } from "../../hooks/useFilterIndicator";
import { cn } from "../../utils/cn";
import Button from "./Button";

type FilterBarProps<T extends string> = {
  items: readonly { id: T; label: string }[];
  selectedId: T;
  onSelect: (id: T) => void;
  resultsId: string;
  label: string;
  layout: "equal" | "scroll";
};

export default function FilterBar<T extends string>({
  items,
  selectedId,
  onSelect,
  resultsId,
  label,
  layout,
}: FilterBarProps<T>) {
  const { trackRef, selectedButtonRef, indicator } = useFilterIndicator(selectedId);
  const isScrollable = layout === "scroll";

  useEffect(() => {
    if (isScrollable) {
      selectedButtonRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [selectedId, isScrollable, selectedButtonRef]);

  const filters = (
    <div
      ref={trackRef}
      role="group"
      aria-label={label}
      className={isScrollable ? "relative flex w-max min-w-full gap-5 px-5" : "relative mx-5 flex"}
    >
      {items.map(({ id, label: itemLabel }) => (
        <Button
          key={id}
          ref={selectedId === id ? selectedButtonRef : undefined}
          aria-pressed={selectedId === id}
          aria-controls={resultsId}
          onClick={() => onSelect(id)}
          className={cn(
            "body-small whitespace-nowrap",
            isScrollable ? "shrink-0" : "flex-1 text-on-dark hover:bg-white/10",
            isScrollable && selectedId === id && "font-bold",
          )}
        >
          {itemLabel}
        </Button>
      ))}
      {indicator && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-on-dark transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
        />
      )}
    </div>
  );

  return isScrollable ? (
    <div className="min-w-0 w-full scroll-px-5 overflow-x-auto overscroll-x-contain">
      {filters}
    </div>
  ) : filters;
}
