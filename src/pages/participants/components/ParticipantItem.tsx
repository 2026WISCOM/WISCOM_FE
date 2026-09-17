import bubbleImage from "../../../assets/bubble.png";
import type { Participant } from "../../../types/participant";

type ParticipantItemProps = {
  participant: Participant;
};

export default function ParticipantItem({ participant }: ParticipantItemProps) {
  return (
    <li className="flex min-w-0 flex-col items-center gap-[9px] text-center">
      <img src={bubbleImage} alt="" width={34} height={34} className="size-[34px] object-contain" />
      <span className="body-medium text-[#f0f0f0]">{participant.name}</span>
    </li>
  );
}
