import storyPlaceholder from "../../../assets/project-placeholder.svg";
import { PARTICIPANTS } from "../../../data/participants";
import type { NeverEndingStory } from "../../../types/neverEndingStory";

const IMAGE_RATIOS = [[4, 5], [4, 3], [1, 1], [3, 4], [16, 9], [2, 3]] as const;

// Names and identities come from the participant source, including namesakes.
// Replace these placeholders with submitted stories keyed by participantId.
export const MOCK_NEVER_ENDING_STORIES: NeverEndingStory[] = PARTICIPANTS.map((participant, index) => {
  const [width, height] = IMAGE_RATIOS[index % IMAGE_RATIOS.length] ?? IMAGE_RATIOS[0];
  return {
    id: `story-${participant.id}`,
    participantId: participant.id,
    name: participant.name,
    introduction: "소감준비중",
    width,
    height,
    image: storyPlaceholder,
    content: "졸업전시회 소감을 준비 중입니다.",
  };
});
