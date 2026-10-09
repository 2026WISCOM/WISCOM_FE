import { useId } from "react";
import { useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import { useDetailModal } from "../hooks/useDetailModal";
import type { NeverEndingStory } from "../types/neverEndingStory";
import NeverEndingStoryDetailModal from "./never-ending-story/components/NeverEndingStoryDetailModal";
import { MOCK_NEVER_ENDING_STORIES } from "./never-ending-story/data/mockNeverEndingStories";
import { STORIES_RELEASE_AT, useStoriesReleased } from "./never-ending-story/hooks/useStoriesReleased";

const STORY_COLUMNS = [0, 1].map((column) =>
  MOCK_NEVER_ENDING_STORIES.filter((_, index) => index % 2 === column),
);

export default function NeverEndingStoryPage() {
  const isReleased = useStoriesReleased();
  const detailId = useId();
  const { state } = useLocation();
  const initialStory = MOCK_NEVER_ENDING_STORIES.find(
    (story) => story.participantId === state?.storyParticipantId,
  ) ?? null;
  const {
    selectedItem: selectedStory,
    isOpen: isDetailOpen,
    open: openStory,
    close: closeStory,
  } = useDetailModal<NeverEndingStory>(initialStory);

  if (!isReleased) {
    return (
      <section className="px-5 pt-navbar pb-footer text-white">
        <h1 className="sr-only">끝나지 않은 이야기</h1>
        <div className="relative overflow-hidden rounded-[5px]">
          <div aria-hidden="true" inert className="pointer-events-none grid grid-cols-2 gap-[13px] select-none blur-md">
            {[[180, 230, 160], [240, 170, 210]].map((heights, column) => (
              <div key={column} className="flex flex-col gap-[13px]">
                {heights.map((height) => (
                  <div key={height} className="rounded-[5px] bg-white/40 p-2">
                    <div className="bg-white/20" style={{ height }} />
                    <div className="mt-2 h-4 w-16 rounded bg-white/50" />
                    <div className="mt-1 h-3 w-24 rounded bg-white/30" />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-deep-navy/45 px-5 text-center break-keep">
            <p className="heading-medium">끝나지 않은 이야기</p>
            <p className="body-small">졸업전시회 소감은 전시 당일 공개됩니다.</p>
            <time dateTime={STORIES_RELEASE_AT} className="body-small">2026. 10. 29. (목) 10:00 공개</time>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 pt-navbar pb-footer text-white">
      <h1 className="sr-only">끝나지 않은 이야기</h1>
      <div className="grid grid-cols-2 items-start gap-[13px]">
        {STORY_COLUMNS.map((stories, column) => (
          <ul key={column} className="flex min-w-0 flex-col gap-[13px]">
            {stories.map((story) => (
              <li key={story.id} className="flex">
                <Button
                  onClick={() => openStory(story)}
                  aria-haspopup="dialog"
                  aria-controls={detailId}
                  aria-label={`${story.name}의 이야기 상세 보기`}
                  className="w-full flex-col rounded-[5px] bg-white/40 p-2 text-left text-white"
                >
                  <img
                    src={story.image}
                    alt=""
                    loading="lazy"
                    className="h-auto w-full object-cover"
                    style={{ aspectRatio: `${story.width} / ${story.height}` }}
                  />
                  <span className="body-medium mt-2 w-full font-bold">{story.name}</span>
                  <span className="body-small w-full break-words"># {story.introduction}</span>
                </Button>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <NeverEndingStoryDetailModal
        id={detailId}
        story={selectedStory}
        isOpen={isDetailOpen}
        onClose={closeStory}
      />
    </section>
  );
}
