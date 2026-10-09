import { useId } from "react";
import { createSearchParams, generatePath, Link } from "react-router-dom";
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
      <div className="glass-dark flex w-full flex-col items-center gap-7 text-center text-on-dark">
        <div className="flex w-full flex-col items-center gap-2.5">
          <img src={bubbleImage} alt="" width={46} height={46} className="size-[46px] object-contain" />
          <div className="flex w-full flex-col items-center gap-5">
            <div className="flex flex-col items-center">
              <h2 id={titleId} className="display-medium">{participant.name}</h2>
              <p className="body-medium">{participant.teamName}</p>
              <p className="body-small mt-3 rounded-full border border-on-dark px-[18px] py-[2px]">
                스튜디오 {participant.studioNumber}
              </p>
            </div>
            <img
              src={participant.projectImage}
              alt={`${participant.name}의 프로젝트 미리보기`}
              className="h-auto w-[calc(100%-80px)] rounded-[8px]"
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-3 px-10">
          <GlassLink
            to={{
              pathname: ROUTES.booths,
              search: createSearchParams({ studio: String(participant.studioNumber) }).toString(),
            }}
            state={{ boothProjectId: participant.projectId }}
            onClick={onClose}
            className="body-medium text-on-dark"
          >
            부스 위치 보기
          </GlassLink>
          <GlassLink
            to={generatePath(ROUTES.projectDetail, { projectId: participant.projectId })}
            onClick={onClose}
            className="body-medium text-on-dark"
          >
            프로젝트 보기
          </GlassLink>
          <p className="body-xsmall col-span-2 mt-2 text-center">
            <strong className="font-bold">끝나지 않은 이야기 -</strong>{" "}
            <Link
              to={ROUTES.neverEndingStory}
              state={{ storyParticipantId: participant.id }}
              onClick={onClose}
              className="rounded-sm underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              졸업전시회 소감 확인하러 가기
            </Link>
          </p>
        </div>
      </div>
    </Modal>
  );
}
