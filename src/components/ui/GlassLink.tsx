import type { ComponentProps } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

type GlassLinkProps = ComponentProps<typeof Link> & {
  focusColor?: "white" | "navy";
};

export default function GlassLink({ className, focusColor = "white", ...props }: GlassLinkProps) {
  return (
    <Link
      className={cn(
        "glass-effect flex h-[58px] items-center justify-center rounded-full px-3 text-center transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 active:brightness-95 motion-reduce:transition-none",
        focusColor === "white" ? "focus-visible:outline-white" : "focus-visible:outline-navy",
        className,
      )}
      {...props}
    />
  );
}
