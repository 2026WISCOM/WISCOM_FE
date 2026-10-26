import { useEffect, useId, useRef } from "react";
import Modal from "../../../components/ui/Modal";
import type { NeverEndingStory } from "../../../types/neverEndingStory";

type NeverEndingStoryDetailModalProps = {
	id: string;
	story: NeverEndingStory | null;
	isOpen: boolean;
	onClose: () => void;
};

export default function NeverEndingStoryDetailModal({
	id,
	story,
	isOpen,
	onClose,
}: NeverEndingStoryDetailModalProps) {
	const titleId = useId();
	const contentRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (isOpen && contentRef.current) contentRef.current.scrollTop = 0;
	}, [isOpen, story?.id]);

	if (!story) return null;

	return (
		<Modal id={id} isOpen={isOpen} labelledBy={titleId} onClose={onClose}>
			<article
				ref={contentRef}
				tabIndex={0}
				aria-labelledby={titleId}
				className="mx-[38px] max-h-[calc(var(--app-frame-height)-10rem)] overflow-y-auto overscroll-contain rounded-[10px] bg-white/40 p-[15px] text-white break-words"
			>
				<img
					src={story.image}
					alt={`${story.name}의 이야기 이미지`}
					decoding="async"
					width={story.width}
					height={story.height}
					className="h-auto w-full"
				/>
				<div className="mt-[11px] flex items-baseline gap-2">
					<h2 id={titleId} className="heading-medium shrink-0">
						{story.name}
					</h2>
					<span className="body-small min-w-0">
						# {story.introduction}
					</span>
				</div>
				<p className="body-small mt-[5px] whitespace-pre-wrap">
					{story.content}
				</p>
			</article>
		</Modal>
	);
}
