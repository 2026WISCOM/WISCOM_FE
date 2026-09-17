import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import IconButton from "./IconButton";
import "./Drawer.css";

type DrawerProps = {
  id: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  headerClassName?: string;
};

export default function Drawer({
  id,
  isOpen,
  title,
  onClose,
  children,
  headerClassName,
}: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return createPortal(
    <dialog
      ref={dialogRef}
      id={id}
      aria-labelledby={titleId}
      className="drawer"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="drawer-panel glass-effect ml-auto flex h-full w-1/2 min-w-[min(20rem,100vw)] flex-col overflow-hidden text-navy">
        <div
          className={cn(
            "flex shrink-0 items-center justify-end px-4 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8",
            headerClassName,
          )}
        >
          <h2 id={titleId} className="sr-only">{title}</h2>
          <IconButton aria-label="메뉴 닫기" onClick={onClose}>
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
              <path d="m6 6 12 12M6 18 18 6" />
            </svg>
          </IconButton>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
