import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../utils/cn";
import CloseButton from "./CloseButton";

const TAIL_POSITIONS = {
  top: "-top-1 left-1/2 -translate-x-1/2",
  bottom: "-bottom-1 left-1/2 -translate-x-1/2",
  left: "top-1/2 -left-1 -translate-y-1/2",
  right: "top-1/2 -right-1 -translate-y-1/2",
} as const;

type TooltipProps = {
  children: ReactNode;
  tail?: keyof typeof TAIL_POSITIONS;
  tailOffset?: CSSProperties["left"];
  color?: "navy" | "pink";
  onClose: () => void;
  className?: string;
};

export default function Tooltip({ children, tail = "bottom", tailOffset, color = "navy", onClose, className }: TooltipProps) {
  return (
    <div
      className={cn(
        "body-small relative inline-flex max-w-full items-center gap-2 rounded-[4px] px-3 py-1 font-bold text-white",
        color === "navy" ? "bg-navy" : "bg-pink",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("pointer-events-none absolute size-2 rotate-45 bg-inherit", TAIL_POSITIONS[tail])}
        style={tail === "top" || tail === "bottom" ? { left: tailOffset } : { top: tailOffset }}
      />
      <span className="min-w-0 break-words">{children}</span>
      <CloseButton
        aria-label="툴팁 닫기"
        onClick={onClose}
        className="size-4! rounded-sm [&>svg]:size-4"
      />
    </div>
  );
}
