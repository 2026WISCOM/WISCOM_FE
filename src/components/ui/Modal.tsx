import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useModalDialog } from "../../hooks/useModalDialog";
import { cn } from "../../utils/cn";
import CloseButton from "./CloseButton";
import "./Modal.css";

type ModalProps = {
  id: string;
  isOpen: boolean;
  labelledBy: string;
  onClose: () => void;
  contentClassName?: string;
  children: ReactNode;
};

export default function Modal({ id, isOpen, labelledBy, onClose, contentClassName, children }: ModalProps) {
  const dialogRef = useModalDialog(isOpen);

  return createPortal(
    <dialog
      ref={dialogRef}
      id={id}
      aria-labelledby={labelledBy}
      className="frame-overlay modal"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <CloseButton
        aria-label="상세 정보 닫기"
        onClick={onClose}
        className="modal-close absolute top-4 right-4 z-10 text-[#f0f0f0]"
      />
      <div
        className="flex h-full flex-col overflow-y-auto overscroll-contain"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          className={cn("modal-content w-full shrink-0", contentClassName ?? "my-auto py-20")}
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          {children}
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
