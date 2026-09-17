import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

type ButtonProps = ComponentProps<"button">;

export default function Button({ className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center justify-center transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}
