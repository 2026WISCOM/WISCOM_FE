import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import type { ProjectTeam } from "../../../types/project";
import { cn } from "../../../utils/cn";

type GuestbookTeamSelectProps = {
  id: string;
  teams: readonly ProjectTeam[];
  value: string;
  onChange: (value: string) => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
  error: boolean;
  disabled: boolean;
};

export default function GuestbookTeamSelect({ id, teams, value, onChange, buttonRef, error, disabled }: GuestbookTeamSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectedIndex = teams.findIndex((team) => team.id === value);
  const selectedTeam = teams[selectedIndex];
  const listId = `${id}-options`;
  const isExpanded = isOpen && !disabled;

  useEffect(() => {
    if (!isOpen) return;
    function handleOutsidePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex]);

  function handleOpenList() {
    setActiveIndex(Math.max(selectedIndex, 0));
    setIsOpen(true);
  }

  function handleSelectTeam(index: number) {
    const team = teams[index];
    if (disabled || !team) return;
    onChange(team.id);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const lastIndex = teams.length - 1;
      if (lastIndex < 0) return;
      setIsOpen(true);
      if (event.key === "Home") setActiveIndex(0);
      else if (event.key === "End") setActiveIndex(lastIndex);
      else if (!isOpen && selectedIndex >= 0) setActiveIndex(selectedIndex);
      else if (!isOpen) setActiveIndex(event.key === "ArrowUp" ? lastIndex : 0);
      else setActiveIndex((index) => Math.max(0, Math.min(lastIndex, index + (event.key === "ArrowDown" ? 1 : -1))));
    } else if (isOpen && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      handleSelectTeam(activeIndex);
    } else if (isOpen && event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative z-10"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        id={id}
        type="button"
        disabled={disabled}
        role="combobox"
        aria-labelledby={`${id}-label`}
        aria-haspopup="listbox"
        aria-expanded={isExpanded}
        aria-controls={isExpanded ? listId : undefined}
        aria-activedescendant={isExpanded && teams[activeIndex] ? `${id}-option-${activeIndex}` : undefined}
        aria-required="true"
        aria-invalid={error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onClick={() => isOpen ? setIsOpen(false) : handleOpenList()}
        onKeyDown={handleKeyDown}
        className={cn(
          "glass-effect body-small relative h-10 w-full cursor-pointer rounded-full pr-[46px] pl-[15px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70",
          selectedTeam ? "text-on-dark" : "text-placeholder",
        )}
      >
        <span className="block truncate">{selectedTeam?.teamName ?? "응원할 팀을 선택해주세요"}</span>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
          className={cn("pointer-events-none absolute top-1/2 right-[15px] -translate-y-1/2 text-on-dark transition-transform duration-300 motion-reduce:transition-none", isExpanded && "rotate-180")}
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>
      {isExpanded && (
        <div className="glass-effect absolute inset-x-0 top-full z-20 overflow-hidden rounded-[22px] [--glass-background:rgba(58,77,98,0.92)] [--glass-fallback-background:#3a4d62] [--glass-solid-background:#3a4d62]">
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className="max-h-[280px] divide-y divide-white/10 overflow-y-auto overscroll-contain"
          >
            {teams.map((team, index) => (
              <li
                key={team.id}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={team.id === value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelectTeam(index)}
                className={cn(
                  "body-small flex h-10 cursor-pointer items-center gap-3 pr-[15px] pl-[26px] text-on-dark hover:bg-white/10",
                  activeIndex === index && "bg-white/10",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{team.teamName}</span>
                {team.id === value && (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                    <path d="m4 9 3 3 7-7" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
