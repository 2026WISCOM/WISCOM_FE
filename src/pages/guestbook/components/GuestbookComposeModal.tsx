import { useId, useRef, useState, type FormEvent } from "react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import type { CreateGuestbookRequest } from "../../../types/guestbook";
import type { ProjectTeam } from "../../../types/project";
import { AUTHOR_MAX_LENGTH, MESSAGE_MAX_LENGTH } from "../constants";
import { getRecipientTeamId } from "../utils";
import GuestbookTeamSelect from "./GuestbookTeamSelect";

type GuestbookComposeModalProps = {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  teams: readonly ProjectTeam[];
  initialRecipientId: string;
  onSubmit: (entry: CreateGuestbookRequest) => Promise<void>;
};

export default function GuestbookComposeModal({
  id,
  isOpen,
  onClose,
  teams,
  initialRecipientId,
  onSubmit,
}: GuestbookComposeModalProps) {
  const titleId = useId();
  const fieldId = useId();
  const [recipient, setRecipient] = useState(() => teams.some(({ id }) => id === initialRecipientId) ? initialRecipientId : "");
  const [recipientError, setRecipientError] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submittingRef = useRef(false);
  const teamButtonRef = useRef<HTMLButtonElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    const form = event.currentTarget;
    if (!teams.some(({ id }) => id === recipient)) {
      setRecipientError(true);
      teamButtonRef.current?.focus();
      return;
    }
    const author = authorRef.current;
    const content = messageRef.current;
    if (!author || !content) return;
    const entry: CreateGuestbookRequest = {
      teamId: getRecipientTeamId(recipient),
      writer: author.value.trim(),
      content: content.value.trim(),
    };

    author.setCustomValidity(entry.writer ? "" : "작성자 이름을 입력해 주세요.");
    content.setCustomValidity(entry.content ? "" : "응원 메시지를 입력해 주세요.");
    if (!form.reportValidity()) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit(entry);
    } catch (error) {
      setSubmitError(error instanceof Error && error.message ? error.message : "방명록을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      id={id}
      isOpen={isOpen}
      labelledBy={titleId}
      onClose={() => {
        if (!submittingRef.current) onClose();
      }}
    >
      <form
        className="w-full px-5 text-on-dark glass-light"
        aria-busy={isSubmitting}
        onSubmit={handleSubmit}
        onInput={(event) => {
          const field = event.target;
          if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
            field.setCustomValidity("");
          }
        }}
      >
        <header className="text-center">
          <h2 id={titleId} className="heading-large">방명록 작성하기</h2>
          <p className="body-small">남기고 싶은 한마디를 적어주세요</p>
        </header>
        <div className="mt-[30px] flex flex-col gap-[15px]">
          <div>
            <label id={`${fieldId}-team-label`} htmlFor={`${fieldId}-team`} className="body-medium block pl-[10px] font-bold">To.</label>
            <GuestbookTeamSelect
              id={`${fieldId}-team`}
              teams={teams}
              value={recipient}
              onChange={(value) => {
                setRecipient(value);
                setRecipientError(false);
              }}
              buttonRef={teamButtonRef}
              error={recipientError}
              disabled={isSubmitting}
            />
            {recipientError && <p id={`${fieldId}-team-error`} role="alert" className="body-small mt-1 pl-[10px]">응원할 팀을 선택해주세요.</p>}
          </div>
          <div>
            <label htmlFor={`${fieldId}-content`} className="body-medium block pl-[10px] font-bold">방명록</label>
            <div className="glass-effect relative h-[170px] rounded-[20px]">
              <textarea
                ref={messageRef}
                id={`${fieldId}-content`}
                name="content"
                value={message}
                onChange={(event) => setMessage(event.currentTarget.value)}
                required
                disabled={isSubmitting}
                maxLength={MESSAGE_MAX_LENGTH}
                aria-describedby={`${fieldId}-count`}
                placeholder="전하고 싶은 말을 자유롭게 적어주세요"
                className="body-small block h-full w-full resize-none rounded-[20px] bg-transparent px-[15px] pt-2 pb-[34px] placeholder:text-placeholder"
              />
              <p id={`${fieldId}-count`} className="body-small pointer-events-none absolute right-[15px] bottom-2 text-placeholder">
                {message.length}/{MESSAGE_MAX_LENGTH}
              </p>
            </div>
          </div>
          <div>
            <label htmlFor={`${fieldId}-author`} className="body-medium block pl-[10px] font-bold">From.</label>
            <input
              ref={authorRef}
              id={`${fieldId}-author`}
              name="author"
              type="text"
              autoComplete="name"
              required
              disabled={isSubmitting}
              maxLength={AUTHOR_MAX_LENGTH}
              aria-label={`From. 작성자 이름 (최대 ${AUTHOR_MAX_LENGTH}자)`}
              placeholder="작성자 이름을 입력해주세요"
              className="glass-effect body-small h-10 w-full rounded-full px-[15px] placeholder:text-placeholder"
            />
          </div>
        </div>
        {submitError && (
          <p role="alert" className="body-small mt-[15px] text-center">{submitError}</p>
        )}
        <Button type="submit" disabled={isSubmitting} className="glass-effect body-medium mt-[30px] h-[58px] w-full rounded-full text-on-dark">
          {isSubmitting ? "저장 중..." : "방명록 남기기"}
        </Button>
      </form>
    </Modal>
  );
}
