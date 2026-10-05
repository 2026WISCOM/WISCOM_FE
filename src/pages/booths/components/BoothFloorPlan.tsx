import { Fragment } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "../../../utils/cn";
import { BOOTH_COLORS } from "../constants";
import { FLOOR_PLAN_BOXES } from "../data/floorPlan";
import BoothFloorPlanTooltip from "./BoothFloorPlanTooltip";

type BoothFloorPlanProps = {
  tooltip?: { studioNumber: number; text: string; isGuide?: boolean };
  onCloseTooltip: () => void;
};

export default function BoothFloorPlan({ tooltip, onCloseTooltip }: BoothFloorPlanProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeStudio = searchParams.get("studio");

  function selectStudio(studioNumber: number) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set("studio", String(studioNumber));
      return next;
    });
  }

  return (
    <section aria-label="전시장 배치도" className="w-full px-[18px]">
      <div className="relative w-full [container-type:inline-size]">
        <div className="relative aspect-[357/557] w-full overflow-hidden rounded-[8px] bg-white">
          {FLOOR_PLAN_BOXES.map((box) => {
            const { text, color, left, top, width, height } = box;
            const bounds = { left, top, width, height };
            const studioNumber = "studioNumber" in box ? box.studioNumber : undefined;
            const colors = BOOTH_COLORS[color];
            const isStudio = studioNumber !== undefined;
            const isActive = isStudio && activeStudio === String(studioNumber);
            const Label = isStudio ? "button" : "span";

            return (
              <Fragment key={text}>
                <div
                  aria-hidden="true"
                  className="absolute rounded-[2px]"
                  style={{
                    ...bounds,
                    ...colors,
                    background: isActive ? colors.color : colors.background,
                    boxShadow: isActive ? `0 0 10px 0 ${colors.color}` : "none",
                  }}
                />
                {/* Flex only centers text; every shape and label uses the root's absolute coordinates. */}
                <Label
                  type={isStudio ? "button" : undefined}
                  aria-pressed={isStudio ? isActive : undefined}
                  onClick={isStudio ? () => selectStudio(studioNumber) : undefined}
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
        {tooltip && <BoothFloorPlanTooltip {...tooltip} onClose={onCloseTooltip} />}
      </div>
    </section>
  );
}
