import { useId, useState } from "react";
import Button from "../components/ui/Button";
import NeverEndingStoryDetailModal from "./never-ending-story/components/NeverEndingStoryDetailModal";
import { MOCK_NEVER_ENDING_STORIES } from "./never-ending-story/data/mockNeverEndingStories";
import type { NeverEndingStory } from "./never-ending-story/data/mockNeverEndingStories";

export default function NeverEndingStoryPage() {
  const detailId = useId();
  const [selectedStory, setSelectedStory] = useState<NeverEndingStory | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  function openStory(story: NeverEndingStory) {
    setSelectedStory(story);
    setIsDetailOpen(true);
  }

  return (
    <section className="dark-gradient-background px-5 pt-[calc(max(1rem,env(safe-area-inset-top))+4rem+43px)] pb-[100px] text-white">
      <h1 className="sr-only">끝나지 않은 이야기</h1>
      <div className="grid grid-cols-2 items-start gap-[13px]">
        {[0, 1].map((column) => (
          <ul key={column} className="flex min-w-0 flex-col gap-[13px]">
            {MOCK_NEVER_ENDING_STORIES.filter((_, index) => index % 2 === column).map((story) => (
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
        onClose={() => setIsDetailOpen(false)}
      />
    </section>
  );
}
