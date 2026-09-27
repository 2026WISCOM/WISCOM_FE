import { Fragment, useState } from "react";
import { cn } from "../../../utils/cn";
import { BOOTH_COLORS } from "../constants";
import { FLOOR_PLAN_BOXES } from "../data/floorPlan";

export default function BoothFloorPlan() {
  const [activeStudio, setActiveStudio] = useState<string | null>(null);

  return (
    <section aria-label="전시장 배치도" className="w-full px-[18px]">
      <div className="w-full">
        <div className="relative aspect-[357/557] w-full overflow-hidden rounded-[8px] bg-white [container-type:inline-size]">
          {FLOOR_PLAN_BOXES.map(({ text, color, ...bounds }) => {
            const colors = BOOTH_COLORS[color];
            const isStudio = color !== "gray";
            const isActive = isStudio && activeStudio === text;
            const Label = isStudio ? "button" : "span";

            return (
              <Fragment key={text}>
                <div
                  aria-hidden="true"
                  className="absolute rounded-[2px]"
                  style={{ ...bounds, ...colors, background: isActive ? colors.color : colors.background }}
                />
                {/* Flex only centers text; every shape and label uses the root's absolute coordinates. */}
                <Label
                  type={isStudio ? "button" : undefined}
                  aria-pressed={isStudio ? isActive : undefined}
                  onClick={isStudio ? () => setActiveStudio(text) : undefined}
                  className={cn(
                    "absolute flex items-center justify-center rounded-[2px] text-center text-[3.3613cqw] leading-[1.25] whitespace-pre",
                    isStudio && "cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2",
                  )}
                  style={{ ...bounds, color: isActive ? "var(--color-on-dark)" : colors.color }}
                >
                  {text}
                </Label>
              </Fragment>
            );
          })}

          <div
            aria-hidden="true"
            className="absolute bg-surface-muted"
            style={{ left: "0%", top: "56.3734%", width: "47.0588%", height: "1.2567%" }}
          />
          <div
            aria-hidden="true"
            className="absolute bg-surface-muted"
            style={{ left: "66.3866%", top: "56.3734%", width: "32.4930%", height: "1.2567%" }}
          />
          <span
            className="absolute z-10 flex items-center justify-center text-center text-[3.3613cqw] leading-[1.25] whitespace-nowrap text-[#525159]"
            style={{ left: "47.0588%", top: "56.3734%", width: "19.3278%", height: "1.2567%" }}
          >
            출입구
          </span>
        </div>
      </div>
    </section>
  );
}
