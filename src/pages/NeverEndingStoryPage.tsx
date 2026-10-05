import { useId } from "react";
import Button from "../components/ui/Button";
import { useDetailModal } from "../hooks/useDetailModal";
import type { NeverEndingStory } from "../types/neverEndingStory";
import NeverEndingStoryDetailModal from "./never-ending-story/components/NeverEndingStoryDetailModal";
import { MOCK_NEVER_ENDING_STORIES } from "./never-ending-story/data/mockNeverEndingStories";

const STORY_COLUMNS = [0, 1].map((column) =>
  MOCK_NEVER_ENDING_STORIES.filter((_, index) => index % 2 === column),
);

export default function NeverEndingStoryPage() {
  const detailId = useId();
  const {
    selectedItem: selectedStory,
    isOpen: isDetailOpen,
    open: openStory,
    close: closeStory,
  } = useDetailModal<NeverEndingStory>();

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
