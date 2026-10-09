import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type ContentSectionProps = {
  headingId: string;
  title: string;
  headingActions?: ReactNode;
  className?: string;
  children: ReactNode;
};

export default function ContentSection({ headingId, title, headingActions, className, children }: ContentSectionProps) {
  return (
    <section aria-labelledby={headingId} className={cn("flex flex-col gap-3.5", className)}>
      <div className="flex items-center gap-3">
        <h2 id={headingId} className="heading-small">{title}</h2>
        {headingActions}
      </div>
      {children}
    </section>
  );
}
