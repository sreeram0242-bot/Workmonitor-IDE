import { supabase } from "@/integrations/supabase/client";

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
  const { data: memberships } = await supabase
    .from("conversation_members")
    .select("conversation_id")
    .eq("user_id", userId);
  const ids = (memberships ?? []).map((m) => m.conversation_id);
  if (ids.length === 0) return [];
  const { data } = await supabase
    .from("conversations")
    .select("*")
    .in("id", ids)
    .order("created_at", { ascending: false });
  return (data ?? []) as Conversation[];
}

export async function fetchConversationMembers(conversationId: string): Promise<string[]> {
  const { data } = await supabase
    .from("conversation_members")
    .select("user_id")
    .eq("conversation_id", conversationId);
  return (data ?? []).map((r) => r.user_id);
}

export const MESSAGES_PAGE_SIZE = 50;

export async function fetchMessages(conversationId: string, limit = MESSAGES_PAGE_SIZE): Promise<Message[]> {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return ((data ?? []) as unknown as Message[]).slice().reverse();
}

export async function fetchOlderMessages(conversationId: string, beforeIso: string, limit = MESSAGES_PAGE_SIZE): Promise<Message[]> {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .lt("created_at", beforeIso)
    .order("created_at", { ascending: false })
    .limit(limit);
  return ((data ?? []) as unknown as Message[]).slice().reverse();
}


export async function fetchMessagesByIds(ids: string[]): Promise<Message[]> {
  if (ids.length === 0) return [];
  const { data } = await supabase.from("messages").select("*").in("id", ids);
  return ((data ?? []) as unknown as Message[]);
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  attachments: ChatAttachment[] = [],
  extras: { reply_to?: string | null; forwarded_from?: string | null; mentions?: string[] } = {},
) {
  const payload: Record<string, unknown> = {
    conversation_id: conversationId,
    sender_id: senderId,
    content,
    attachments: attachments as unknown as never,
  };
  if (extras.reply_to) payload.reply_to = extras.reply_to;
  if (extras.forwarded_from) payload.forwarded_from = extras.forwarded_from;
  if (extras.mentions && extras.mentions.length > 0) payload.mentions = extras.mentions;
  const { error } = await supabase.from("messages").insert(payload as never);
  if (error) throw error;

  try {
    const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
    const apiKey = import.meta.env.VITE_ONESIGNAL_API_KEY;
    if (appId && apiKey) {
      const members = await fetchConversationMembers(conversationId);
      const targetIds = members.filter(id => id !== senderId);

      if (targetIds.length > 0) {
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", senderId).maybeSingle();
        const senderName = profile?.full_name || "Someone";
        
        await fetch("https://onesignal.com/api/v1/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${apiKey}`,
          },
          body: JSON.stringify({
            app_id: appId,
            include_aliases: {
              external_id: targetIds
            },
            target_channel: "push",
            headings: { en: senderName },
            contents: { en: content || "Sent an attachment" },
          }),
        });
      }
    }
  } catch (err) {
    console.error("Failed to send push notification", err);
  }
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
  const extPart = file.name.includes(".") ? file.name.split(".").pop() : "";
  const path = `${conversationId}/${userId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extPart ? "." + extPart : ""}`;
  const { error } = await supabase.storage.from("chat-attachments").upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw error;
  const { data: signed } = await supabase.storage
    .from("chat-attachments")
    .createSignedUrl(path, 60 * 60 * 24 * 7);
  return {
    path,
    url: signed?.signedUrl ?? "",
    name: file.name,
    type: file.type || "application/octet-stream",
    size: file.size,
    kind: attachmentKind(file.type || ""),
  };
}

export async function findOrCreateDM(currentUserId: string, otherUserId: string): Promise<string> {
  const { data: mine } = await supabase
    .from("conversation_members")
    .select("conversation_id, conversations!inner(id, is_group)")
    .eq("user_id", currentUserId);
  const dmIds = (mine ?? [])
    .filter((r: any) => r.conversations?.is_group === false)
    .map((r: any) => r.conversation_id);
  if (dmIds.length > 0) {
    const { data: match } = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .in("conversation_id", dmIds)
      .eq("user_id", otherUserId)
      .maybeSingle();
    if (match?.conversation_id) return match.conversation_id;
  }
  const { data: conv, error } = await supabase
    .from("conversations")
    .insert({ is_group: false, name: null })
    .select("id")
    .single();
  if (error || !conv) throw error ?? new Error("Failed to create conversation");
  await supabase.from("conversation_members").insert([
    { conversation_id: conv.id, user_id: currentUserId },
    { conversation_id: conv.id, user_id: otherUserId },
  ]);
  return conv.id;
}

export async function createGroup(
  currentUserId: string,
  name: string,
  memberIds: string[],
): Promise<string> {
  const { data: conv, error } = await supabase
    .from("conversations")
    .insert({ is_group: true, name })
    .select("id")
    .single();
  if (error || !conv) throw error ?? new Error("Failed to create group");
  const ids = Array.from(new Set([currentUserId, ...memberIds]));
  await supabase
    .from("conversation_members")
    .insert(ids.map((id) => ({ conversation_id: conv.id, user_id: id })));
  return conv.id;
}

export async function editMessage(messageId: string, content: string) {
  const { error } = await supabase
    .from("messages")
    .update({ content, edited_at: new Date().toISOString() })
    .eq("id", messageId);
  if (error) throw error;
}

export async function deleteMessage(messageId: string) {
  const { error } = await supabase
    .from("messages")
    .update({ content: "", attachments: [] as unknown as never, deleted_at: new Date().toISOString() })
    .eq("id", messageId);
  if (error) throw error;
}

// Delete-for-me: hides just for the current user via RPC.
export async function deleteMessageForMe(messageId: string) {
  const { error } = await supabase.rpc("hide_message_for_me" as never, { _message_id: messageId } as never);
  if (error) throw error;
}

export async function leaveConversation(conversationId: string) {
  const { error } = await supabase.rpc("leave_conversation" as never, { _conv: conversationId } as never);
  if (error) throw error;
}

export async function toggleMuteConversation(conversationId: string, mute: boolean) {
  const { error } = await supabase.rpc("toggle_mute_conversation" as never, { _conv: conversationId, _mute: mute } as never);
  if (error) throw error;
}

export async function fetchMuteMap(userId: string): Promise<Record<string, boolean>> {
  const { data } = await supabase
    .from("conversation_members")
    .select("conversation_id, muted_at")
    .eq("user_id", userId);
  const map: Record<string, boolean> = {};
  for (const r of (data ?? []) as any[]) map[r.conversation_id] = Boolean(r.muted_at);
  return map;
}


export async function togglePinMessage(messageId: string, userId: string, pinned: boolean) {
  const { error } = await supabase
    .from("messages")
    .update({
      pinned_at: pinned ? new Date().toISOString() : null,
      pinned_by: pinned ? userId : null,
    })
    .eq("id", messageId);
  if (error) throw error;
}

export async function fetchPinnedMessages(conversationId: string): Promise<Message[]> {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .not("pinned_at", "is", null)
    .order("pinned_at", { ascending: false });
  return ((data ?? []) as unknown as Message[]);
}

export async function fetchReactions(conversationId: string): Promise<Reaction[]> {
  // fetch reactions for all messages in the conversation
  const { data: msgs } = await supabase
    .from("messages")
    .select("id")
    .eq("conversation_id", conversationId);
  const ids = (msgs ?? []).map((m: any) => m.id);
  if (ids.length === 0) return [];
  const { data } = await supabase.from("message_reactions").select("*").in("message_id", ids);
  return (data ?? []) as Reaction[];
}

export async function toggleReaction(messageId: string, userId: string, emoji: string, has: boolean) {
  if (has) {
    await supabase
      .from("message_reactions")
      .delete()
      .eq("message_id", messageId)
      .eq("user_id", userId)
      .eq("emoji", emoji);
  } else {
    await supabase
      .from("message_reactions")
      .insert({ message_id: messageId, user_id: userId, emoji });
  }
}

export async function fetchStarredIds(userId: string): Promise<string[]> {
  const { data } = await supabase.from("starred_messages").select("message_id").eq("user_id", userId);
  return (data ?? []).map((r: any) => r.message_id);
}

export async function toggleStar(messageId: string, userId: string, starred: boolean) {
  if (starred) {
    await supabase.from("starred_messages").delete().eq("message_id", messageId).eq("user_id", userId);
  } else {
    await supabase.from("starred_messages").insert({ message_id: messageId, user_id: userId });
  }
}

export async function markConversationRead(conversationId: string, userId: string) {
  await supabase
    .from("conversation_members")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("user_id", userId);
}

export async function fetchLastReadMap(userId: string): Promise<Record<string, string>> {
  const { data } = await supabase
    .from("conversation_members")
    .select("conversation_id, last_read_at")
    .eq("user_id", userId);
  const map: Record<string, string> = {};
  for (const r of data ?? []) map[(r as any).conversation_id] = (r as any).last_read_at;
  return map;
}

export async function fetchLastReadByMembers(conversationId: string): Promise<Record<string, string>> {
  const { data } = await supabase
    .from("conversation_members")
    .select("user_id, last_read_at")
    .eq("conversation_id", conversationId);
  const map: Record<string, string> = {};
  for (const r of data ?? []) map[(r as any).user_id] = (r as any).last_read_at;
  return map;
}

export async function fetchUnreadCounts(
  userId: string,
  conversationIds: string[],
  lastRead: Record<string, string>,
): Promise<Record<string, number>> {
  const result: Record<string, number> = {};
  await Promise.all(
    conversationIds.map(async (cid) => {
      const since = lastRead[cid] ?? new Date(0).toISOString();
      const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("conversation_id", cid)
        .neq("sender_id", userId)
        .gt("created_at", since);
      result[cid] = count ?? 0;
    }),
  );
  return result;
}

export async function renameGroup(conversationId: string, name: string) {
  const { error } = await supabase.from("conversations").update({ name }).eq("id", conversationId);
  if (error) throw error;
}

export async function addGroupMembers(conversationId: string, userIds: string[]) {
  if (userIds.length === 0) return;
  const { error } = await supabase
    .from("conversation_members")
    .insert(userIds.map((user_id) => ({ conversation_id: conversationId, user_id })));
  if (error) throw error;
}

export async function removeGroupMember(conversationId: string, userId: string) {
  const { error } = await supabase
    .from("conversation_members")
    .delete()
    .eq("conversation_id", conversationId)
    .eq("user_id", userId);
  if (error) throw error;
}

// Parse @Firstname / @FullName mentions from text; return matched user ids.
export function extractMentions(
  text: string,
  team: { id: string; full_name: string }[],
): string[] {
  const found = new Set<string>();
  const re = /@([\p{L}][\p{L}0-9._-]{1,40})/gu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const token = m[1].toLowerCase();
    for (const t of team) {
      const first = (t.full_name.split(" ")[0] ?? "").toLowerCase();
      const full = t.full_name.toLowerCase().replace(/\s+/g, "");
      if (token === first || token === full) { found.add(t.id); break; }
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
  { id: "fire",     label: "Fire",     icon: "🔥" },
  { id: "hearts",   label: "Hearts",   icon: "❤️" },
  { id: "confetti", label: "Confetti", icon: "🎉" },
  { id: "sparkles", label: "Sparkle",  icon: "✨" },
  { id: "neon",     label: "Neon",     icon: "💡" },
  { id: "shake",    label: "Shake",    icon: "💥" },
  { id: "rainbow",  label: "Rainbow",  icon: "🌈" },
  { id: "snow",     label: "Snow",     icon: "❄️" },
] as const;
export type MessageEffect = typeof MESSAGE_EFFECTS[number]["id"];

const FX_RE = /^\[\[fx:([a-z]+)\]\]\s*/;
export function parseEffect(content: string | null | undefined): { effect: MessageEffect | null; text: string } {
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

