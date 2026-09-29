import { useId } from "react";
import Modal from "../../../components/ui/Modal";
import type { NeverEndingStory } from "../../../types/neverEndingStory";

type NeverEndingStoryDetailModalProps = {
  id: string;
  story: NeverEndingStory | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function NeverEndingStoryDetailModal({ id, story, isOpen, onClose }: NeverEndingStoryDetailModalProps) {
  const titleId = useId();
  if (!story) return null;

  return (
    <Modal id={id} isOpen={isOpen} labelledBy={titleId} onClose={onClose}>
      <article className="mx-[38px] rounded-[10px] bg-white/40 p-[15px] text-white break-words">
        <img
          src={story.image}
          alt={`${story.name}의 이야기 이미지`}
          className="h-auto w-full object-cover"
          style={{ aspectRatio: `${story.width} / ${story.height}` }}
        />
        <h2 id={titleId} className="heading-large mt-[11px]">{story.name}</h2>
        <div className="body-large mt-[5px]">
          <p># {story.introduction}</p>
          <p>{story.content}</p>
        </div>
      </article>
    </Modal>
  );
}
