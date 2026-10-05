import type { ComponentProps, CSSProperties } from "react";
import Tooltip from "../../../components/ui/Tooltip";
import { FLOOR_PLAN_BOXES } from "../data/floorPlan";

const STUDIO_BOXES = FLOOR_PLAN_BOXES.filter((box) => "studioNumber" in box);
// The 8px rotated tail extends about 6px: leave another 8px before the studio.
const GAP = 14;
const LEFT_INSET = 4;

type BoothFloorPlanTooltipProps = {
  studioNumber: number;
  text: string;
  isGuide?: boolean;
  onClose: () => void;
};

export default function BoothFloorPlanTooltip({ studioNumber, text, isGuide = false, onClose }: BoothFloorPlanTooltipProps) {
  const box = STUDIO_BOXES.find((studio) => studio.studioNumber === studioNumber);
  const rightColumn = STUDIO_BOXES.find((studio) => studio.studioNumber === 4);
  const topRow = STUDIO_BOXES.find((studio) => studio.studioNumber === 5);
  const bottomLeft = STUDIO_BOXES.find((studio) => studio.studioNumber === 10);
  if (!box || !rightColumn || !topRow || !bottomLeft) return null;

  const top = parseFloat(box.top);
  const bottom = top + parseFloat(box.height);
  const right = parseFloat(box.left) + parseFloat(box.width);
  const columnLeft = parseFloat(rightColumn.left);
  const style: CSSProperties = {
    width: "max-content",
    maxWidth: `calc(${columnLeft - LEFT_INSET}% - ${GAP}px)`,
    right: `calc(${100 - columnLeft}% + ${GAP}px)`,
  };
  let tail: ComponentProps<typeof Tooltip>["tail"] = "right";
  let tailOffset = "16px";

  if (isGuide) {
    style.top = `calc(${bottom}% + ${GAP}px)`;
    style.left = "50%";
    style.right = undefined;
    style.maxWidth = undefined;
    style.transform = "translateX(-50%)";
    tail = "top";
    tailOffset = `calc(50% + ${parseFloat(box.left) + parseFloat(box.width) / 2 - 50}cqw)`;
  } else if (studioNumber === 5 || studioNumber === 6) {
    // Below the top row, keeping clear of studios 3 and 4 on the right.
    style.top = `calc(${bottom}% + ${GAP}px)`;
    tail = "top";
    const center = parseFloat(box.left) + parseFloat(box.width) / 2;
    if (studioNumber === 6) {
      style.left = `${center}%`;
      style.right = undefined;
      style.transform = "translateX(-50%)";
      style.maxWidth = `calc(${2 * (columnLeft - center)}% - ${2 * GAP}px)`;
      tailOffset = "50%";
    } else {
      tailOffset = `calc(100% - ${columnLeft - center}cqw + ${GAP}px)`;
    }
  } else if (studioNumber === 4) {
    style.top = `calc(${parseFloat(topRow.top) + parseFloat(topRow.height)}% + ${GAP}px)`;
  } else if (studioNumber === 3) {
    style.top = `${top}%`;
  } else if (studioNumber === 10) {
    // Use the aisle on the right, keeping the tooltip clear of studio 1.
    style.left = `calc(${right}% + ${GAP}px)`;
    style.right = undefined;
    style.maxWidth = `calc(${columnLeft - right}% - ${2 * GAP}px)`;
    style.bottom = `${100 - bottom}%`;
    tail = "left";
    tailOffset = "calc(100% - 16px)";
  } else {
    // Grow upward on the left so long titles do not cover studio 10.
    style.bottom = studioNumber === 1
      ? `calc(${100 - parseFloat(bottomLeft.top)}% + ${GAP}px)`
      : `${100 - bottom}%`;
    tailOffset = "calc(100% - 16px)";
  }

  return (
    <div className="absolute z-20" style={style}>
      <Tooltip
        tail={tail}
        tailOffset={tailOffset}
        color={box.color}
        onClose={onClose}
        className={isGuide ? "font-normal! whitespace-nowrap" : undefined}
      >
        {text}
      </Tooltip>
    </div>
  );
}
