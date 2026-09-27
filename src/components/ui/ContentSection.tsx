import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type ContentSectionProps = {
  headingId: string;
  title: string;
  className?: string;
  children: ReactNode;
};

export default function ContentSection({ headingId, title, className, children }: ContentSectionProps) {
  return (
    <section aria-labelledby={headingId} className={cn("flex flex-col gap-3.5", className)}>
      <h2 id={headingId} className="heading-small">{title}</h2>
      {children}
    </section>
  );
}
