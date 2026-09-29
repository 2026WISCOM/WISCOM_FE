import type { ComponentProps } from "react";
import IconButton from "./IconButton";

type CloseButtonProps = Omit<ComponentProps<typeof IconButton>, "children">;

export default function CloseButton(props: CloseButtonProps) {
  return (
    <IconButton {...props}>
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
  );
}
