export type GuestbookEntry = {
  id: number;
  teamId: string;
  writer: string;
  content: string;
  createdAt: string;
};

export type CreateGuestbookRequest = Pick<GuestbookEntry, "teamId" | "writer" | "content">;
