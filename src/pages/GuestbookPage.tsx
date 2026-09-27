import { useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import IconButton from "../components/ui/IconButton";
import { useFilterIndicator } from "../hooks/useFilterIndicator";
import { cn } from "../utils/cn";
import GuestbookComposeModal from "./guestbook/components/GuestbookComposeModal";
import type { GuestbookDraft } from "./guestbook/components/GuestbookComposeModal";
import { GUESTBOOK_TEAMS, MOCK_GUESTBOOK_ENTRIES } from "./guestbook/data/mockGuestbookEntries";

const TEAM_FILTERS = [{ id: "", teamName: "전체" }, { id: "all", teamName: "모두에게" }, ...GUESTBOOK_TEAMS];

export default function GuestbookPage() {
  const [searchParams] = useSearchParams();
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    const projectId = searchParams.get("projectId");
    return TEAM_FILTERS.find(({ id }) => id === projectId)?.id ?? "";
  });
  const [entries, setEntries] = useState(MOCK_GUESTBOOK_ENTRIES);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeSession, setComposeSession] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const pageRef = useRef<HTMLElement>(null);
  const { trackRef, selectedButtonRef, indicator } = useFilterIndicator(selectedProjectId);
  const resultsId = useId();
  const composeId = useId();
  const visibleEntries = selectedProjectId
    ? entries.filter(({ projectId }) => projectId === (selectedProjectId === "all" ? "" : selectedProjectId))
    : entries;

  useEffect(() => {
    selectedButtonRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [selectedProjectId]);

  function addEntry(draft: GuestbookDraft) {
    setEntries((previous) => [{ id: crypto.randomUUID(), ...draft }, ...previous]);
    setSelectedProjectId(draft.projectId || "all");
    setIsComposeOpen(false);
    setAnnouncement(`${draft.author}님의 방명록이 추가되었습니다.`);
    pageRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }

  return (
    <section ref={pageRef} className="dark-gradient-background min-w-0 w-full pt-[calc(max(1rem,env(safe-area-inset-top))+4rem+24px)] pb-[100px] text-[#f0f0f0]">
      <h1 className="sr-only">방명록</h1>
      <div className="min-w-0 w-full scroll-px-5 overflow-x-auto overscroll-x-contain">
        <div ref={trackRef} role="group" aria-label="팀별 방명록 필터" className="relative flex w-max min-w-full gap-5 px-5">
          {TEAM_FILTERS.map(({ id, teamName }) => (
            <Button
              key={id}
              ref={selectedProjectId === id ? selectedButtonRef : undefined}
              aria-pressed={selectedProjectId === id}
              aria-controls={resultsId}
              onClick={() => setSelectedProjectId(id)}
              className={cn(
                "body-small shrink-0 whitespace-nowrap",
                selectedProjectId === id && "font-bold",
              )}
            >
              {teamName}
            </Button>
          ))}
          {indicator && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-[#f0f0f0] transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
              style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
            />
          )}
        </div>
      </div>

      <ul
        id={resultsId}
        aria-label="방명록 목록"
        className="mt-6 flex min-w-0 w-full flex-col gap-[18px] px-5 [--glass-background:rgba(255,255,255,0.25)] [--glass-fallback-background:rgba(255,255,255,0.25)] [--glass-solid-background:#4a5c70]"
      >
        {visibleEntries.length > 0 ? visibleEntries.map((entry) => (
          <li key={entry.id} className="glass-effect body-small flex min-w-0 w-full flex-col gap-[5px] rounded-[8px] px-[18px] py-4 [overflow-wrap:anywhere]">
            <p className="font-bold">To. {GUESTBOOK_TEAMS.find(({ id }) => id === entry.projectId)?.teamName ?? "모두에게"}</p>
            <p className="whitespace-pre-wrap">{entry.content}</p>
            <p className="text-right font-bold">From. {entry.author}</p>
          </li>
        )) : (
          <li className="body-small text-center">
            아직 등록된 방명록이 없습니다<br />
            첫 응원을 남겨 주세요
          </li>
        )}
      </ul>
      <p role="status" className="sr-only">{announcement}</p>

      <IconButton
        aria-label="방명록 추가"
        aria-haspopup="dialog"
        aria-controls={composeId}
        onClick={() => {
          setComposeSession((previous) => previous + 1);
          setIsComposeOpen(true);
        }}
        className="absolute right-[34px] bottom-[34px] z-40 text-white hover:brightness-110"
        style={{ backgroundColor: "#EF79A8" }}
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
      </IconButton>

      {composeSession > 0 && (
        <GuestbookComposeModal
          key={composeSession}
          id={composeId}
          isOpen={isComposeOpen}
          onClose={() => setIsComposeOpen(false)}
          projects={GUESTBOOK_TEAMS}
          initialProjectId={selectedProjectId}
          onSubmit={addEntry}
        />
      )}
    </section>
  );
}
