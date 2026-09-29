import FilterBar from "../../../components/ui/FilterBar";
import { PARTICIPANT_FILTERS } from "../constants";
import type { ParticipantFilter } from "../constants";

const FILTER_ITEMS = PARTICIPANT_FILTERS.map((filter) => ({ id: filter, label: filter }));

type ParticipantFiltersProps = {
  selectedFilter: ParticipantFilter;
  onSelect: (filter: ParticipantFilter) => void;
  resultsId: string;
};

export default function ParticipantFilters({ selectedFilter, onSelect, resultsId }: ParticipantFiltersProps) {
  return (
    <FilterBar
      items={FILTER_ITEMS}
      selectedId={selectedFilter}
      onSelect={onSelect}
      resultsId={resultsId}
      label="이름 초성 필터"
      layout="equal"
    />
  );
}
