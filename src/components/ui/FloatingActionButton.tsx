import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";
import IconButton from "./IconButton";

export default function FloatingActionButton({
  className,
  ...props
}: ComponentProps<typeof IconButton>) {
  return (
    <IconButton
      className={cn("absolute right-[34px] bottom-[34px] z-40", className)}
      {...props}
    />
  );
}
