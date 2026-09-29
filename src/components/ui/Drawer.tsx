import { useId } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useModalDialog } from "../../hooks/useModalDialog";
import { cn } from "../../utils/cn";
import CloseButton from "./CloseButton";
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
  const dialogRef = useModalDialog(isOpen);
  const titleId = useId();

  return createPortal(
    <dialog
      ref={dialogRef}
      id={id}
      aria-labelledby={titleId}
      className="frame-overlay drawer"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="drawer-panel ml-auto flex h-full flex-col text-navy">
        <div aria-hidden="true" className="drawer-surface glass-effect" />
        <div
          className={cn(
            "flex shrink-0 items-center justify-end px-4 pt-[max(1.5rem,env(safe-area-inset-top))]",
            headerClassName,
          )}
        >
          <h2 id={titleId} className="sr-only">{title}</h2>
          <CloseButton aria-label="메뉴 닫기" onClick={onClose} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
