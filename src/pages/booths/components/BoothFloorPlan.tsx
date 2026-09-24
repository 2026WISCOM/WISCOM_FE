import { Fragment, useState } from "react";
import { cn } from "../../../utils/cn";
import { BOOTH_COLORS } from "../constants";

const BOXES = [
  {
    text: "포토존", color: "gray",
    left: "4.4818%", top: "3.2316%", width: "21.2885%", height: "15.9785%",
  },
  {
    text: "스튜디오\n6", color: "navy",
    left: "28.0112%", top: "3.2316%", width: "18.2073%", height: "7.8995%",
  },
  {
    text: "스튜디오\n5", color: "navy",
    left: "48.7395%", top: "3.2316%", width: "18.2073%", height: "7.8995%",
  },
  {
    text: "스튜디오 4", color: "navy",
    left: "69.6078%", top: "3.3214%", width: "25.2101%", height: "24.0575%",
  },
  {
    text: "휴식\n공간", color: "gray",
    left: "40.6162%", top: "26.9300%", width: "20.1681%", height: "19.2101%",
  },
  {
    text: "포\n토\n월", color: "gray",
    left: "16.8067%", top: "35.5476%", width: "9.8039%", height: "20.8259%",
  },
  {
    text: "스튜디오 3", color: "navy",
    left: "69.6078%", top: "29.3537%", width: "25.2101%", height: "24.0575%",
  },
  {
    text: "엘리베이터", color: "gray",
    left: "0%", top: "60.5027%", width: "21.2885%", height: "4.3088%",
  },
  {
    text: "안내데스크", color: "gray",
    left: "25.2101%", top: "60.5027%", width: "21.2885%", height: "4.3088%",
  },
  {
    text: "스튜디오 2", color: "pink",
    left: "69.6078%", top: "60.5925%", width: "25.2101%", height: "13.8241%",
  },
  {
    text: "스튜디오 1", color: "pink",
    left: "69.6078%", top: "76.3914%", width: "25.2101%", height: "16.3375%",
  },
  {
    text: "스튜디오\n10", color: "pink",
    left: "8.5434%", top: "84.2908%", width: "16.8067%", height: "12.5673%",
  },
] as const;

export default function BoothFloorPlan() {
  const [activeStudio, setActiveStudio] = useState<string | null>(null);

  return (
    <section aria-label="전시장 배치도" className="w-full px-[18px]">
      <div className="w-full">
        <div className="relative aspect-[357/557] w-full overflow-hidden rounded-[8px] bg-white [container-type:inline-size]">
          {BOXES.map(({ text, color, ...bounds }) => {
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
                  style={{ ...bounds, color: isActive ? "#F0F0F0" : colors.color }}
                >
                  {text}
                </Label>
              </Fragment>
            );
          })}

          <div
            aria-hidden="true"
            className="absolute bg-[#ededed]"
            style={{ left: "0%", top: "56.3734%", width: "47.0588%", height: "1.2567%" }}
          />
          <div
            aria-hidden="true"
            className="absolute bg-[#ededed]"
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
