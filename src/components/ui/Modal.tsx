import type { MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useModalDialog } from "../../hooks/useModalDialog";
import CloseButton from "./CloseButton";
import "./Modal.css";

type ModalProps = {
  id: string;
  isOpen: boolean;
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ id, isOpen, labelledBy, onClose, children }: ModalProps) {
  const dialogRef = useModalDialog(isOpen);

  function handleBackdropClick(event: MouseEvent<HTMLElement>) {
    if (event.target === event.currentTarget) onClose();
  }

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
      onClick={handleBackdropClick}
    >
      <CloseButton
        aria-label="상세 정보 닫기"
        onClick={onClose}
        className="modal-close absolute top-4 right-4 z-10 text-on-dark"
      />
      <div
        className="flex h-full flex-col overflow-y-auto overscroll-contain"
        onClick={handleBackdropClick}
      >
        <div
          className="modal-content my-auto w-full shrink-0 py-20"
          onClick={handleBackdropClick}
        >
          {children}
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
