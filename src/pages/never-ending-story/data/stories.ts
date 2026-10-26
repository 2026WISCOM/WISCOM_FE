import { PARTICIPANTS } from "../../../data/participants";
import type { NeverEndingStory } from "../../../types/neverEndingStory";
import submissions from "./submissions.json";

const images = import.meta.glob<string>("../../../assets/optimized/behind/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

function normalizeTeamName(name: string) {
  return name.toLowerCase().replaceAll(":", "");
}

export const NEVER_ENDING_STORIES: NeverEndingStory[] = PARTICIPANTS.map((participant) => {
  const submission = submissions.find((story) =>
    story.name === participant.name
      && normalizeTeamName(story.teamName) === normalizeTeamName(participant.teamName),
  );
  const image = submission && images[`../../../assets/optimized/behind/${submission.image}`];
  const thumbnail = submission && images[`../../../assets/optimized/behind/${submission.thumbnail}`];
  if (!submission || !image || !thumbnail) {
    throw new Error(`Missing story or image: ${participant.name} (${participant.teamName})`);
  }
  return {
    ...submission,
    id: `story-${participant.id}`,
    participantId: participant.id,
    image,
    thumbnail,
  };
});
