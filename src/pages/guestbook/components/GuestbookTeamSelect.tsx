import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { cn } from "../../../utils/cn";

type GuestbookTeamSelectProps = {
  id: string;
  projects: readonly { id: string; teamName: string }[];
  value: string;
  onChange: (value: string) => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
  error: boolean;
};

export default function GuestbookTeamSelect({ id, projects, value, onChange, buttonRef, error }: GuestbookTeamSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectedIndex = projects.findIndex((project) => project.id === value);
  const selectedTeam = projects[selectedIndex];
  const listId = `${id}-options`;

  useEffect(() => {
    if (!isOpen) return;
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex]);

  function openList() {
    setActiveIndex(Math.max(selectedIndex, 0));
    setIsOpen(true);
  }

  function selectTeam(index: number) {
    if (!projects[index]) return;
    onChange(projects[index].id);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const lastIndex = projects.length - 1;
      if (lastIndex < 0) return;
      setIsOpen(true);
      if (event.key === "Home") setActiveIndex(0);
      else if (event.key === "End") setActiveIndex(lastIndex);
      else if (!isOpen) setActiveIndex(selectedIndex >= 0 ? selectedIndex : event.key === "ArrowUp" ? lastIndex : 0);
      else setActiveIndex((index) => Math.max(0, Math.min(lastIndex, index + (event.key === "ArrowDown" ? 1 : -1))));
    } else if (isOpen && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      selectTeam(activeIndex);
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
        role="combobox"
        aria-labelledby={`${id}-label`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-activedescendant={isOpen && projects[activeIndex] ? `${id}-option-${activeIndex}` : undefined}
        aria-required="true"
        aria-invalid={error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onClick={() => isOpen ? setIsOpen(false) : openList()}
        onKeyDown={handleKeyDown}
        className={cn(
          "glass-effect body-small relative h-10 w-full cursor-pointer rounded-full pr-[46px] pl-[15px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70",
          selectedTeam ? "text-[#f0f0f0]" : "text-[#b7b7b7]",
        )}
      >
        <span className="block truncate">{selectedTeam?.teamName ?? "응원할 팀을 선택해주세요"}</span>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
          className={cn("pointer-events-none absolute top-1/2 right-[15px] -translate-y-1/2 text-[#f0f0f0] transition-transform duration-300 motion-reduce:transition-none", isOpen && "rotate-180")}
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>
      {isOpen && (
        <div className="glass-effect absolute inset-x-0 top-full z-20 overflow-hidden rounded-[22px] [--glass-background:rgba(58,77,98,0.92)] [--glass-fallback-background:#3a4d62] [--glass-solid-background:#3a4d62]">
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className="max-h-[280px] divide-y divide-white/10 overflow-y-auto overscroll-contain"
          >
            {projects.map((project, index) => (
              <li
                key={project.id}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={project.id === value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectTeam(index)}
                className={cn(
                  "body-small flex h-10 cursor-pointer items-center gap-3 pr-[15px] pl-[26px] text-[#f0f0f0] hover:bg-white/10",
                  activeIndex === index && "bg-white/10",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{project.teamName}</span>
                {project.id === value && (
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
