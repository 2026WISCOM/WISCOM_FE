import { useId, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import FilterBar from "../components/ui/FilterBar";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import type { CreateGuestbookRequest } from "../types/guestbook";
import GuestbookComposeModal from "./guestbook/components/GuestbookComposeModal";
import GuestbookList from "./guestbook/components/GuestbookList";
import { GUESTBOOK_TEAMS } from "./guestbook/constants";
import { useGuestbooks } from "./guestbook/hooks/useGuestbooks";
import { filterGuestbookEntries, getGuestbookFilters, getGuestbookTeams, getInitialGuestbookFilter } from "./guestbook/utils";

export default function GuestbookPage() {
  const [searchParams] = useSearchParams();
  const [selectedFilterId, setSelectedFilterId] = useState(() => getInitialGuestbookFilter(searchParams));
  const { entries, status, error, retry, addEntry } = useGuestbooks();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeSession, setComposeSession] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const pageRef = useRef<HTMLElement>(null);
  const resultsId = useId();
  const composeId = useId();
  const teams = getGuestbookTeams(entries, selectedFilterId);
  const visibleEntries = filterGuestbookEntries(entries, selectedFilterId);

  async function handleAddEntry(draft: CreateGuestbookRequest) {
    const entry = await addEntry(draft);
    setSelectedFilterId(`team:${entry.teamId}`);
    setIsComposeOpen(false);
    setAnnouncement(`${entry.writer}님의 방명록이 등록되었습니다.`);
    pageRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }

  return (
    <section ref={pageRef} className="dark-gradient-background min-w-0 w-full pt-navbar pb-footer text-on-dark">
      <h1 className="sr-only">방명록</h1>
      <FilterBar
        items={getGuestbookFilters(teams)}
        selectedId={selectedFilterId}
        onSelect={setSelectedFilterId}
        resultsId={resultsId}
        label="팀별 방명록 필터"
        layout="scroll"
      />
      {status === "success" ? (
        <GuestbookList id={resultsId} entries={visibleEntries} />
      ) : (
        <div id={resultsId} aria-busy={status === "loading"} className="body-small mt-6 px-5 text-center">
          {status === "loading" ? (
            <p role="status">방명록을 불러오는 중입니다.</p>
          ) : (
            <>
              <p role="alert">{error}</p>
              <Button onClick={retry} className="mt-3 rounded-full border border-current px-5">다시 시도</Button>
            </>
          )}
        </div>
      )}
      <p role="status" className="sr-only">{announcement}</p>

      <FloatingActionButton
        aria-label="방명록 추가"
        aria-haspopup="dialog"
        aria-controls={composeId}
        onClick={() => {
          setAnnouncement("");
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
          teams={GUESTBOOK_TEAMS}
          initialRecipientId={selectedFilterId}
          onSubmit={handleAddEntry}
        />
      )}
    </section>
  );
}
