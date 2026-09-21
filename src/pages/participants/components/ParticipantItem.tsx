import bubbleImage from "../../../assets/bubble.png";
import type { Participant } from "../../../types/participant";
import Button from "../../../components/ui/Button";

type ParticipantItemProps = {
  participant: Participant;
  onSelect: (participant: Participant) => void;
  dialogId: string;
};

export default function ParticipantItem({ participant, onSelect, dialogId }: ParticipantItemProps) {
  return (
    <li className="min-w-0">
      <Button
        onClick={() => onSelect(participant)}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-label={`${participant.name} 상세 정보`}
        className="w-full flex-col gap-[9px] rounded-lg text-center text-[#f0f0f0]"
      >
        <img src={bubbleImage} alt="" width={34} height={34} className="size-[34px] object-contain" />
        <span className="body-medium">{participant.name}</span>
      </Button>
    </li>
  );
}
