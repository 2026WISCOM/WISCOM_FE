import type { GuestbookEntry } from "../../../types/guestbook";

type GuestbookListProps = {
  id: string;
  entries: readonly GuestbookEntry[];
};

export default function GuestbookList({ id, entries }: GuestbookListProps) {
  return (
    <ul
      id={id}
      aria-label="방명록 목록"
      className="mt-6 flex min-w-0 w-full flex-col gap-[18px] px-5 glass-light"
    >
      {entries.length > 0 ? entries.map((entry) => (
        <li key={entry.id} className="glass-effect body-small flex min-w-0 w-full flex-col gap-[5px] rounded-[8px] px-[18px] py-4 [overflow-wrap:anywhere]">
          <p className="font-bold">To. {entry.teamId || "수신 팀 미지정"}</p>
          <p className="whitespace-pre-wrap">{entry.content}</p>
          <p className="text-right font-bold">From. {entry.writer}</p>
        </li>
      )) : (
        <li className="body-small text-center">
          아직 등록된 방명록이 없습니다<br />
          첫 응원을 남겨 주세요
        </li>
      )}
    </ul>
  );
}
