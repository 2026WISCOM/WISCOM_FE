import { useId, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterBar from "../components/ui/FilterBar";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import GuestbookComposeModal from "./guestbook/components/GuestbookComposeModal";
import GuestbookList from "./guestbook/components/GuestbookList";
import { ALL_GUESTBOOK_FILTER_ID, EVERYONE_RECIPIENT, GUESTBOOK_FILTERS } from "./guestbook/constants";
import { GUESTBOOK_TEAMS, MOCK_GUESTBOOK_ENTRIES } from "./guestbook/data/mockGuestbookEntries";
import type { GuestbookDraft } from "./guestbook/types";
import { filterGuestbookEntries } from "./guestbook/utils";

export default function GuestbookPage() {
  const [searchParams] = useSearchParams();
  const [selectedFilterId, setSelectedFilterId] = useState(() => {
    const projectId = searchParams.get("projectId");
    return GUESTBOOK_FILTERS.find(({ id }) => id === projectId)?.id ?? ALL_GUESTBOOK_FILTER_ID;
  });
  const [entries, setEntries] = useState(MOCK_GUESTBOOK_ENTRIES);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeSession, setComposeSession] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const pageRef = useRef<HTMLElement>(null);
  const resultsId = useId();
  const composeId = useId();
  const visibleEntries = filterGuestbookEntries(entries, selectedFilterId);

  function handleAddEntry(draft: GuestbookDraft) {
    setEntries((previous) => [{ id: crypto.randomUUID(), ...draft }, ...previous]);
    setSelectedFilterId(draft.projectId || EVERYONE_RECIPIENT.id);
    setIsComposeOpen(false);
    setAnnouncement(`${draft.author}님의 방명록이 추가되었습니다.`);
    pageRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }

  return (
    <section ref={pageRef} className="dark-gradient-background min-w-0 w-full pt-navbar pb-[100px] text-on-dark">
      <h1 className="sr-only">방명록</h1>
      <FilterBar
        items={GUESTBOOK_FILTERS}
        selectedId={selectedFilterId}
        onSelect={setSelectedFilterId}
        resultsId={resultsId}
        label="팀별 방명록 필터"
        layout="scroll"
      />
      <GuestbookList id={resultsId} entries={visibleEntries} />
      <p role="status" className="sr-only">{announcement}</p>

      <FloatingActionButton
        aria-label="방명록 추가"
        aria-haspopup="dialog"
        aria-controls={composeId}
        onClick={() => {
          setComposeSession((previous) => previous + 1);
          setIsComposeOpen(true);
        }}
        className="text-white hover:brightness-110"
        style={{ backgroundColor: "var(--color-pink)" }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </FloatingActionButton>

      {composeSession > 0 && (
        <GuestbookComposeModal
          key={composeSession}
          id={composeId}
          isOpen={isComposeOpen}
          onClose={() => setIsComposeOpen(false)}
          projects={GUESTBOOK_TEAMS}
          initialProjectId={selectedFilterId}
          onSubmit={handleAddEntry}
        />
      )}
    </section>
  );
}
