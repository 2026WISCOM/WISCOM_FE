import Button from "../../../components/ui/Button";
import { PARTICIPANT_FILTERS } from "../constants";
import type { ParticipantFilter } from "../constants";
import { useFilterIndicator } from "../hooks/useFilterIndicator";

type ParticipantFiltersProps = {
  selectedFilter: ParticipantFilter;
  onSelect: (filter: ParticipantFilter) => void;
  resultsId: string;
};

export default function ParticipantFilters({ selectedFilter, onSelect, resultsId }: ParticipantFiltersProps) {
  const { trackRef, selectedButtonRef, indicator } = useFilterIndicator(selectedFilter);

  return (
    <div ref={trackRef} role="group" aria-label="이름 초성 필터" className="relative mx-5 flex">
      {PARTICIPANT_FILTERS.map((filter) => (
        <Button
          key={filter}
          ref={selectedFilter === filter ? selectedButtonRef : undefined}
          aria-pressed={selectedFilter === filter}
          aria-controls={resultsId}
          onClick={() => onSelect(filter)}
          className="body-small flex-1 whitespace-nowrap text-[#f0f0f0] hover:bg-white/10"
        >
          {filter}
        </Button>
      ))}
      {indicator && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-[#f0f0f0] transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
          }}
        />
      )}
    </div>
  );
}
