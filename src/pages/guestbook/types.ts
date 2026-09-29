export type GuestbookDraft = {
  projectId: string;
  author: string;
  content: string;
};

export type GuestbookEntry = GuestbookDraft & {
  id: string;
};
