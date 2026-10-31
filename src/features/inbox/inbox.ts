export type InboxItem = {
  id: number;
  profile: string;
  session: string;
  event_id: string;
  kind: string;
  occurred: number;
  title: string;
  preview: string;
  read: boolean;
};
export type InboxPage = {
  revision?: string;
  items: InboxItem[];
  unread: number;
  byProfile: Record<string, number>;
  nextCursor: string | null;
};
export const inboxLabels: Record<string, string> = {
  "turn.complete": "Response completed",
  approval: "Approval required",
  clarify: "Clarification required",
  attention: "Attention required",
};
