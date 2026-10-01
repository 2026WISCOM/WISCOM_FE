import { useEffect, useState } from "react";
import { createGuestbook, getGuestbooks } from "../../../api/guestbook";
import type { CreateGuestbookRequest, GuestbookEntry } from "../../../types/guestbook";

type GuestbookState = {
  entries: GuestbookEntry[];
  status: "loading" | "success" | "error";
  error: string | null;
};

export function useGuestbooks() {
  const [state, setState] = useState<GuestbookState>({ entries: [], status: "loading", error: null });
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ entries: [], status: "loading", error: null });

    getGuestbooks(controller.signal).then(
      (entries) => {
        if (!controller.signal.aborted) setState({ entries, status: "success", error: null });
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          entries: [],
          status: "error",
          error: error instanceof Error ? error.message : "방명록을 불러오지 못했습니다.",
        });
      },
    );

    return () => controller.abort();
  }, [requestVersion]);

  function retry() {
    setRequestVersion((previous) => previous + 1);
  }

  async function addEntry(draft: CreateGuestbookRequest) {
    const entry = await createGuestbook(draft);
    retry();
    return entry;
  }

  return { ...state, retry, addEntry };
}
