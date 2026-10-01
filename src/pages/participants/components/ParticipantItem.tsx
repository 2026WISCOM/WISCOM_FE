import bubbleImage from "../../../assets/bubble.png";
import type { Participant } from "../../../types/participant";
import Button from "../../../components/ui/Button";

type ParticipantItemProps = {
  participant: Participant;
  showTeamName: boolean;
  onSelect: (participant: Participant) => void;
  dialogId: string;
};

export default function ParticipantItem({ participant, showTeamName, onSelect, dialogId }: ParticipantItemProps) {
  return (
    <li className="min-w-0">
      <Button
        onClick={() => onSelect(participant)}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-label={`${participant.name} (${participant.teamName}) 상세 정보`}
        className="w-full flex-col gap-[9px] rounded-lg text-center text-on-dark"
      >
        <img src={bubbleImage} alt="" width={34} height={34} className="size-[34px] object-contain" />
        <span>
          <span className="body-medium block">{participant.name}</span>
          {showTeamName && <span className="body-xxsmall -mt-0.5 block">{participant.teamName}</span>}
        </span>
      </Button>
    </li>
  );
}
