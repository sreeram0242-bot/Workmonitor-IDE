import {
  fetchMyConversations as serverFetchMyConversations,
  fetchConversationMembers as serverFetchConversationMembers,
  fetchMessages as serverFetchMessages,
  fetchOlderMessages as serverFetchOlderMessages,
  fetchMessagesByIds as serverFetchMessagesByIds,
  sendMessage as serverSendMessage,
  uploadChatAttachment as serverUploadChatAttachment,
  findOrCreateDM as serverFindOrCreateDM,
  createGroup as serverCreateGroup,
  editMessage as serverEditMessage,
  deleteMessage as serverDeleteMessage,
  deleteMessageForMe as serverDeleteMessageForMe,
  leaveConversation as serverLeaveConversation,
  toggleMuteConversation as serverToggleMuteConversation,
  fetchMuteMap as serverFetchMuteMap,
  togglePinMessage as serverTogglePinMessage,
  fetchPinnedMessages as serverFetchPinnedMessages,
  fetchReactions as serverFetchReactions,
  toggleReaction as serverToggleReaction,
  fetchStarredIds as serverFetchStarredIds,
  toggleStar as serverToggleStar,
  markConversationRead as serverMarkConversationRead,
  fetchLastReadMap as serverFetchLastReadMap,
  fetchLastReadByMembers as serverFetchLastReadByMembers,
  fetchUnreadCounts as serverFetchUnreadCounts,
  renameGroup as serverRenameGroup,
  addGroupMembers as serverAddGroupMembers,
  removeGroupMember as serverRemoveGroupMember,
} from "./chat.functions";

export interface Conversation {
  id: string;
  name: string | null;
  is_group: boolean;
  created_by: string;
  created_at: string;
}

export interface ChatAttachment {
  path: string;
  url: string;
  name: string;
  type: string;
  size: number;
  kind: "image" | "video" | "file" | "audio";
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  edited_at?: string | null;
  deleted_at?: string | null;
  attachments?: ChatAttachment[];
  reply_to?: string | null;
  pinned_at?: string | null;
  pinned_by?: string | null;
  forwarded_from?: string | null;
  mentions?: string[] | null;
}

export interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
}

export async function fetchMyConversations(userId: string): Promise<Conversation[]> {
  return (await serverFetchMyConversations()) as any;
}

export async function fetchConversationMembers(conversationId: string): Promise<string[]> {
  return await serverFetchConversationMembers({ data: conversationId });
}

export const MESSAGES_PAGE_SIZE = 50;

export async function fetchMessages(
  conversationId: string,
  limit = MESSAGES_PAGE_SIZE,
): Promise<Message[]> {
  return (await serverFetchMessages({ data: { conversationId, limit } })) as any;
}

export async function fetchOlderMessages(
  conversationId: string,
  beforeIso: string,
  limit = MESSAGES_PAGE_SIZE,
): Promise<Message[]> {
  return (await serverFetchOlderMessages({ data: { conversationId, beforeIso, limit } })) as any;
}

export async function fetchMessagesByIds(ids: string[]): Promise<Message[]> {
  return (await serverFetchMessagesByIds({ data: ids })) as any;
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  attachments: ChatAttachment[] = [],
  extras: { reply_to?: string | null; forwarded_from?: string | null; mentions?: string[] } = {},
) {
  await serverSendMessage({
    data: {
      conversationId,
      content,
      attachments,
      replyTo: extras.reply_to,
      forwardedFrom: extras.forwarded_from,
      mentions: extras.mentions,
    },
  });
}

function attachmentKind(mime: string): "image" | "video" | "file" | "audio" {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "file";
}

export async function uploadChatAttachment(
  conversationId: string,
  userId: string,
  file: File,
): Promise<ChatAttachment> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return (await serverUploadChatAttachment({
    data: {
      conversationId,
      fileBase64: base64,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
    },
  })) as any;
}

export async function findOrCreateDM(currentUserId: string, otherUserId: string): Promise<string> {
  return await serverFindOrCreateDM({ data: otherUserId });
}

export async function createGroup(
  currentUserId: string,
  name: string,
  memberIds: string[],
): Promise<string> {
  return await serverCreateGroup({ data: { name, memberIds } });
}

export async function editMessage(messageId: string, content: string) {
  await serverEditMessage({ data: { messageId, content } });
}

export async function deleteMessage(messageId: string) {
  await serverDeleteMessage({ data: messageId });
}

// Delete-for-me: hides just for the current user via RPC.
export async function deleteMessageForMe(messageId: string) {
  await serverDeleteMessageForMe({ data: messageId });
}

export async function leaveConversation(conversationId: string) {
  await serverLeaveConversation({ data: conversationId });
}

export async function toggleMuteConversation(conversationId: string, mute: boolean) {
  await serverToggleMuteConversation({ data: { conversationId, mute } });
}

export async function fetchMuteMap(userId: string): Promise<Record<string, boolean>> {
  return await serverFetchMuteMap();
}

export async function togglePinMessage(messageId: string, userId: string, pinned: boolean) {
  await serverTogglePinMessage({ data: { messageId, pinned } });
}

export async function fetchPinnedMessages(conversationId: string): Promise<Message[]> {
  return (await serverFetchPinnedMessages({ data: conversationId })) as any;
}

export async function fetchReactions(conversationId: string): Promise<Reaction[]> {
  return (await serverFetchReactions({ data: conversationId })) as any;
}

export async function toggleReaction(
  messageId: string,
  userId: string,
  emoji: string,
  has: boolean,
) {
  await serverToggleReaction({ data: { messageId, emoji, has } });
}

export async function fetchStarredIds(userId: string): Promise<string[]> {
  return await serverFetchStarredIds();
}

export async function toggleStar(messageId: string, userId: string, starred: boolean) {
  await serverToggleStar({ data: { messageId, starred } });
}

export async function markConversationRead(conversationId: string, userId: string) {
  await serverMarkConversationRead({ data: conversationId });
}

export async function fetchLastReadMap(userId: string): Promise<Record<string, string>> {
  return await serverFetchLastReadMap();
}

export async function fetchLastReadByMembers(
  conversationId: string,
): Promise<Record<string, string>> {
  return await serverFetchLastReadByMembers({ data: conversationId });
}

export async function fetchUnreadCounts(
  userId: string,
  conversationIds: string[],
  lastRead: Record<string, string>,
): Promise<Record<string, number>> {
  return await serverFetchUnreadCounts({ data: { conversationIds, lastRead } });
}

export async function renameGroup(conversationId: string, name: string) {
  await serverRenameGroup({ data: { conversationId, name } });
}

export async function addGroupMembers(conversationId: string, userIds: string[]) {
  await serverAddGroupMembers({ data: { conversationId, userIds } });
}

export async function removeGroupMember(conversationId: string, userId: string) {
  await serverRemoveGroupMember({ data: { conversationId, userId } });
}

// Parse @Firstname / @FullName mentions from text; return matched user ids.
export function extractMentions(text: string, team: { id: string; full_name: string }[]): string[] {
  const found = new Set<string>();
  const re = /@([\p{L}][\p{L}0-9._-]{1,40})/gu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const token = m[1].toLowerCase();
    for (const t of team) {
      const first = (t.full_name.split(" ")[0] ?? "").toLowerCase();
      const full = t.full_name.toLowerCase().replace(/\s+/g, "");
      if (token === first || token === full) {
        found.add(t.id);
        break;
      }
    }
  }
  return Array.from(found);
}

// Extract first http(s) URL from a text message
export function extractFirstUrl(text: string): string | null {
  const m = text.match(/https?:\/\/[^\s<>"']+/i);
  return m ? m[0] : null;
}

// Developer-only message effects. Encoded as a `[[fx:name]] ` prefix in content
// so no schema change is needed. Rendering strips the marker and adds a class.
export const MESSAGE_EFFECTS = [
  { id: "fire", label: "Fire", icon: "🔥" },
  { id: "hearts", label: "Hearts", icon: "❤️" },
  { id: "confetti", label: "Confetti", icon: "🎉" },
  { id: "sparkles", label: "Sparkle", icon: "✨" },
  { id: "neon", label: "Neon", icon: "💡" },
  { id: "shake", label: "Shake", icon: "💥" },
  { id: "rainbow", label: "Rainbow", icon: "🌈" },
  { id: "snow", label: "Snow", icon: "❄️" },
] as const;
export type MessageEffect = (typeof MESSAGE_EFFECTS)[number]["id"];

const FX_RE = /^\[\[fx:([a-z]+)\]\]\s*/;
export function parseEffect(content: string | null | undefined): {
  effect: MessageEffect | null;
  text: string;
} {
  if (!content) return { effect: null, text: content ?? "" };
  const m = content.match(FX_RE);
  if (!m) return { effect: null, text: content };
  const id = m[1] as MessageEffect;
  const ok = MESSAGE_EFFECTS.some((e) => e.id === id);
  return { effect: ok ? id : null, text: content.replace(FX_RE, "") };
}

export function encodeEffect(effect: MessageEffect | null, text: string): string {
  return effect ? `[[fx:${effect}]] ${text}` : text;
}
