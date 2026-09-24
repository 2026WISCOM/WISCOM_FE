import { generatePath, Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import BoothFloorPlan from "./booths/components/BoothFloorPlan";
import { BOOTH_COLORS } from "./booths/constants";
import { MOCK_PROJECTS } from "./projects/data/mockProjects";

const LEGEND_ITEMS = [
  { label: "내부 전시 공간", color: "navy" },
  { label: "외부 전시 공간", color: "pink" },
  { label: "공용 공간", color: "gray" },
] as const;

const EXHIBITION_SPACES = [
  { id: "indoor", title: "내부 전시 공간", color: "navy", studios: [6, 5, 4, 3] },
  { id: "outdoor", title: "외부 전시 공간", color: "pink", studios: [2, 1, 10] },
] as const;

export default function BoothPage() {
  return (
    <div className="bg-[#fbfbfb] pt-[calc(max(1rem,env(safe-area-inset-top))+4rem+43px)] pb-32">
      <h1 className="sr-only">부스배치도</h1>
      <ul aria-label="배치도 범례" className="body-xsmall flex items-center justify-between px-9 text-[#81909b]">
        {LEGEND_ITEMS.map(({ label, color }) => (
          <li key={color} className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="size-[18px] shrink-0 rounded-[2px]"
              style={{
                ...BOOTH_COLORS[color],
                border: `1px solid ${color === "gray" ? BOOTH_COLORS.gray.background : BOOTH_COLORS[color].color}`,
              }}
            />
            <span className="min-w-0 break-keep">{label}</span>
          </li>
        ))}
      </ul>
      <div className="mt-[13px]">
        <BoothFloorPlan />
      </div>

      <div className="mt-12 flex flex-col gap-[43px]">
        {EXHIBITION_SPACES.map(({ id, title, color, studios }) => (
          <section key={id} aria-labelledby={`${id}-heading`}>
            <div className="flex items-center gap-[15px] px-[21px]" style={{ color: BOOTH_COLORS[color].color }}>
              <h2 id={`${id}-heading`} className="heading-large shrink-0">{title}</h2>
              <div aria-hidden="true" className="h-0.5 flex-1 bg-current" />
            </div>

            <div className="mt-6 flex flex-col gap-8 px-5">
              {studios.map((studioNumber) => (
                <section key={studioNumber} aria-labelledby={`studio-${studioNumber}-heading`} className="flex flex-col gap-3">
                  <h3
                    id={`studio-${studioNumber}-heading`}
                    className="body-small self-start rounded-full px-[19px] py-0.5 text-[#f0f0f0]"
                    style={{ backgroundColor: BOOTH_COLORS[color].color }}
                  >
                    스튜디오 {studioNumber}
                  </h3>
                  <ul className="body-small flex list-disc flex-col gap-3 pl-5 text-[#172a3a]">
                    {MOCK_PROJECTS.filter((project) => project.studioNumber === studioNumber).map((project) => (
                      <li key={project.id}>
                        <Link
                          to={generatePath(ROUTES.projectDetail, { projectId: project.id })}
                          className="flex items-center justify-between gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
                        >
                          <span className="min-w-0 break-keep">
                            <strong className="font-bold">{project.title}</strong>{" "}
                            <span className="text-[#81909b]">{project.members.map(({ name }) => name).join(" ")}</span>
                          </span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className="size-4 shrink-0 text-[#81909b]"
                          >
                            <path d="m9 5 7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
