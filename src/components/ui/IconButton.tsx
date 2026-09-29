import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

type IconButtonProps = ComponentProps<"button"> & {
  "aria-label": string;
};

export default function IconButton({
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}
