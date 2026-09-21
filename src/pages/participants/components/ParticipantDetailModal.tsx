import { useId } from "react";
import { createSearchParams, generatePath } from "react-router-dom";
import bubbleImage from "../../../assets/bubble.png";
import GlassLink from "../../../components/ui/GlassLink";
import Modal from "../../../components/ui/Modal";
import { ROUTES } from "../../../constants/routes";
import type { Participant } from "../../../types/participant";

type ParticipantDetailModalProps = {
  id: string;
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ParticipantDetailModal({ id, participant, isOpen, onClose }: ParticipantDetailModalProps) {
  const titleId = useId();
  if (!participant) return null;

  return (
    <Modal id={id} isOpen={isOpen} labelledBy={titleId} onClose={onClose}>
      <div className="glass-dark flex w-full flex-col items-center gap-7 text-center text-[#f0f0f0]">
        <div className="flex w-full flex-col items-center gap-2.5">
          <img src={bubbleImage} alt="" width={46} height={46} className="size-[46px] object-contain" />
          <div className="flex w-full flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-1">
              <h2 id={titleId} className="display-medium">{participant.name}</h2>
              <p className="body-small rounded-full border border-[#f0f0f0] px-[18px] py-[2px]">
                스튜디오 {participant.studioNumber}
              </p>
            </div>
            <img
              src={participant.projectImage}
              alt={`${participant.name}의 프로젝트 미리보기`}
              className="h-auto w-[calc(100%-80px)]"
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-3 px-10">
          <GlassLink
            to={{
              pathname: ROUTES.booths,
              search: createSearchParams({ studio: String(participant.studioNumber) }).toString(),
            }}
            onClick={onClose}
            className="body-medium text-[#f0f0f0]"
          >
            부스 위치 보기
          </GlassLink>
          <GlassLink
            to={generatePath(ROUTES.projectDetail, { projectId: participant.projectId })}
            onClick={onClose}
            className="body-medium text-[#f0f0f0]"
          >
            프로젝트 보기
          </GlassLink>
        </div>
      </div>
    </Modal>
  );
}
