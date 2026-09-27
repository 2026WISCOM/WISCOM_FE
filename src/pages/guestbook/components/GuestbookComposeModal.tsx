import { useId, useRef, useState, type FormEvent } from "react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import type { ProjectTeam } from "../../../types/project";
import { AUTHOR_MAX_LENGTH, EVERYONE_RECIPIENT, MESSAGE_MAX_LENGTH } from "../constants";
import type { GuestbookDraft } from "../types";
import { getRecipientProjectId } from "../utils";
import GuestbookTeamSelect from "./GuestbookTeamSelect";

type GuestbookComposeModalProps = {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  projects: readonly ProjectTeam[];
  initialProjectId: string;
  onSubmit: (entry: GuestbookDraft) => void;
};

export default function GuestbookComposeModal({
  id,
  isOpen,
  onClose,
  projects,
  initialProjectId,
  onSubmit,
}: GuestbookComposeModalProps) {
  const titleId = useId();
  const fieldId = useId();
  const [recipient, setRecipient] = useState(initialProjectId);
  const [recipientError, setRecipientError] = useState(false);
  const [message, setMessage] = useState("");
  const teamButtonRef = useRef<HTMLButtonElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (recipient !== EVERYONE_RECIPIENT.id && !projects.some(({ id }) => id === recipient)) {
      setRecipientError(true);
      teamButtonRef.current?.focus();
      return;
    }
    const author = authorRef.current;
    const content = messageRef.current;
    if (!author || !content) return;
    const entry = {
      projectId: getRecipientProjectId(recipient),
      author: author.value.trim(),
      content: content.value.trim(),
    };

    author.setCustomValidity(entry.author ? "" : "작성자 이름을 입력해 주세요.");
    content.setCustomValidity(entry.content ? "" : "응원 메시지를 입력해 주세요.");
    if (form.reportValidity()) onSubmit(entry);
  }

  return (
    <Modal
      id={id}
      isOpen={isOpen}
      labelledBy={titleId}
      onClose={onClose}
    >
      <form
        className="w-full px-5 text-on-dark glass-light"
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
              projects={[EVERYONE_RECIPIENT, ...projects]}
              value={recipient}
              onChange={(value) => {
                setRecipient(value);
                setRecipientError(false);
              }}
              buttonRef={teamButtonRef}
              error={recipientError}
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
              maxLength={AUTHOR_MAX_LENGTH}
              aria-label={`From. 작성자 이름 (최대 ${AUTHOR_MAX_LENGTH}자)`}
              placeholder="작성자 이름을 입력해주세요"
              className="glass-effect body-small h-10 w-full rounded-full px-[15px] placeholder:text-placeholder"
            />
          </div>
        </div>
        <Button type="submit" className="glass-effect body-medium mt-[30px] h-[58px] w-full rounded-full text-on-dark">
          방명록 남기기
        </Button>
      </form>
    </Modal>
  );
}
