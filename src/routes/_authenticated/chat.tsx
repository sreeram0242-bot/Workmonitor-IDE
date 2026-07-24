import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Send,
  Users,
  MessageSquare,
  ArrowLeft,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  Film,
  Search,
  Sparkles,
  Smile,
  MoreVertical,
  Pencil,
  Trash2,
  LogOut,
  UserPlus,
  Settings2,
  Check,
  Reply,
  Pin,
  PinOff,
  Forward,
  Star,
  Mic,
  Square as StopIcon,
  CheckCheck,
  Link as LinkIcon,
  Bell,
  BellOff,
  Wand2,
} from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PersonIcon } from "@/components/brand/PersonIcon";
import { BadgePill } from "@/components/brand/BadgePill";

import { useAuth } from "@/hooks/use-auth";
import { sendNotifications } from "@/lib/notify";
import { fetchTeam, getCachedTeam, type TeamMember } from "@/lib/tasks";
import {
  fetchMyConversations,
  fetchMessages,
  fetchOlderMessages,
  MESSAGES_PAGE_SIZE,
  fetchConversationMembers,
  sendMessage,
  findOrCreateDM,
  createGroup,
  uploadChatAttachment,
  editMessage,
  deleteMessage,
  deleteMessageForMe,
  leaveConversation,
  toggleMuteConversation,
  fetchMuteMap,
  markConversationRead,
  fetchLastReadMap,
  fetchLastReadByMembers,
  fetchUnreadCounts,
  renameGroup,
  addGroupMembers,
  removeGroupMember,
  fetchPinnedMessages,
  togglePinMessage,
  fetchReactions,
  toggleReaction,
  fetchStarredIds,
  toggleStar,
  fetchMessagesByIds,
  extractMentions,
  extractFirstUrl,
  parseEffect,
  encodeEffect,
  MESSAGE_EFFECTS,
  type MessageEffect,
  type Conversation,
  type Message,
  type ChatAttachment,
  type Reaction,
} from "@/lib/chat";

import { useRealtimeSubscription } from "@/hooks/use-realtime";

import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title: "Team Chat — C-Enterprises WorkMonitor" },
      {
        name: "description",
        content:
          "Real-time direct messages, group chat, and file sharing for the C-Enterprises team.",
      },
      { property: "og:title", content: "Team Chat — C-Enterprises WorkMonitor" },
      {
        property: "og:description",
        content: "Collaborate with real-time messages, groups, photos, videos, and files.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatPage,
});

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const s = Math.floor(diff / 1000);
  if (s < 45) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
}

function useTick(intervalMs: number = 60_000) {
  const [, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}

function avatarColor(seed: string) {
  const palette = [
    "from-blue-500 to-indigo-600",
    "from-sky-500 to-blue-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-cyan-500 to-blue-600",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function Avatar({
  name,
  group,
  admin,
  size = 40,
  online,
  url,
}: {
  name: string;
  group?: boolean;
  admin?: boolean;
  size?: number;
  online?: boolean;
  url?: string | null;
}) {
  const hasImage = !!url && !group;
  const gradient = avatarColor(name || "x");
  const bgClass = hasImage
    ? `bg-gradient-to-br ${gradient} text-white`
    : group
      ? `bg-gradient-to-br ${gradient} text-white`
      : admin
        ? "bg-brand-accent/10 text-brand-accent"
        : "bg-muted text-muted-foreground";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={`flex h-full w-full items-center justify-center overflow-hidden rounded-full ${bgClass} shadow-sm ring-2 ring-background`}
      >
        {hasImage ? (
          <img src={url!} alt={name} className="h-full w-full object-cover" />
        ) : group ? (
          <Users className="h-1/2 w-1/2" />
        ) : (
          <PersonIcon admin={admin} className="h-[62%] w-[62%]" />
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
      )}
    </div>
  );
}

function ChatPage() {
  const { user, profile } = useAuth();
  useTick(60_000);
  const [team, setTeam] = useState<TeamMember[]>(() => getCachedTeam() ?? []);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convMembers, setConvMembers] = useState<Record<string, string[]>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingEffect, setPendingEffect] = useState<MessageEffect | null>(null);
  const [uploading, setUploading] = useState(false);

  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [lastRead, setLastRead] = useState<Record<string, string>>({});
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [manageOpen, setManageOpen] = useState(false);
  const [hasMoreOlder, setHasMoreOlder] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [pinned, setPinned] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [inChatSearch, setInChatSearch] = useState(false);
  const [mutes, setMutes] = useState<Record<string, boolean>>({});
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [inChatQuery, setInChatQuery] = useState("");
  const [showStarredPanel, setShowStarredPanel] = useState(false);
  const [starredMessages, setStarredMessages] = useState<Message[]>([]);
  const [forwardMessage, setForwardMessage] = useState<Message | null>(null);
  const [readByMap, setReadByMap] = useState<Record<string, string>>({});
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeIdRef = useRef<string | null>(null);

  const lastTypingSentRef = useRef<number>(0);

  const teamById = useMemo(() => new Map(team.map((m) => [m.id, m])), [team]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  async function reloadConversations() {
    if (!user) return;
    const [convs, t] = await Promise.all([fetchMyConversations(user.id), fetchTeam()]);
    setConversations(convs);
    setTeam(t);
    const memberMap: Record<string, string[]> = {};
    await Promise.all(
      convs.map(async (c) => {
        memberMap[c.id] = await fetchConversationMembers(c.id);
      }),
    );
    setConvMembers(memberMap);
    const lr = await fetchLastReadMap(user.id);
    setLastRead(lr);
    const uc = await fetchUnreadCounts(
      user.id,
      convs.map((c) => c.id),
      lr,
    );
    setUnread(uc);
    setMutes(await fetchMuteMap(user.id));
  }

  useEffect(() => {
    reloadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useRealtimeSubscription("conversations", `user-${user?.id}`, () => {
    reloadConversations();
  });

  // Load starred ids once per user
  useEffect(() => {
    if (!user) return;
    fetchStarredIds(user.id).then((ids) => setStarredIds(new Set(ids)));
  }, [user?.id]);

  useEffect(() => {
    if (!activeId || !user) {
      setMessages([]);
      setOnlineUsers(new Set());
      setTypingUsers(new Set());
      setHasMoreOlder(false);
      setReactions([]);
      setPinned([]);
      setReplyTo(null);
      setInChatSearch(false);
      setInChatQuery("");
      setReadByMap({});
      return;
    }

    function loadChat() {
      fetchMessages(activeId).then((msgs) => {
        setMessages(msgs);
        setHasMoreOlder(msgs.length >= MESSAGES_PAGE_SIZE);
      });
      fetchPinnedMessages(activeId).then(setPinned);
      fetchReactions(activeId).then(setReactions);
      fetchLastReadByMembers(activeId).then(setReadByMap);
      markConversationRead(activeId, user!.id).then(() => {
        setLastRead((prev) => ({ ...prev, [activeId]: new Date().toISOString() }));
        setUnread((prev) => ({ ...prev, [activeId]: 0 }));
      });
    }

    loadChat();
  }, [activeId, user?.id]);

  useRealtimeSubscription("chat", `message-${activeId}`, () => {
    if (!activeId || !user) return;
    fetchMessages(activeId).then((msgs) => {
      setMessages(msgs);
      setHasMoreOlder(msgs.length >= MESSAGES_PAGE_SIZE);
    });
  });

  useEffect(() => {
    if (loadingOlder) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, activeId, typingUsers, loadingOlder]);

  function broadcastTyping() {
    // Disabled presence for polling MVP
  }

  async function handleSend() {
    if (!user || !activeId) return;
    if (!input.trim() && pendingFiles.length === 0) return;
    const content = input.trim();
    const files = pendingFiles;
    const reply = replyTo;
    const effect = pendingEffect;
    const mentionIds = extractMentions(content, team);
    setInput("");
    setPendingFiles([]);
    setReplyTo(null);
    setPendingEffect(null);
    setUploading(true);
    try {
      const attachments: ChatAttachment[] = [];
      for (const f of files) attachments.push(await uploadChatAttachment(activeId, user.id, f));
      const encoded = encodeEffect(effect, content);
      await sendMessage(activeId, user.id, encoded, attachments, {
        reply_to: reply?.id ?? null,
        mentions: mentionIds,
      });

      await markConversationRead(activeId, user.id);
      const members = convMembers[activeId] ?? [];
      const others = members.filter((m) => m !== user.id);
      const senderName = teamById.get(user.id)?.full_name ?? "teammate";
      const notifications: Array<{ user_id: string; type: string; message: string; link: string }> =
        [];
      if (others.length > 0) {
        for (const uid of others) {
          if (mentionIds.includes(uid)) {
            // Always deliver @mentions
            notifications.push({
              user_id: uid,
              type: "mention",
              message: `${senderName} mentioned you`,
              link: "/chat",
            });
          } else {
            // sendNotifications handles profile checking
            notifications.push({
              user_id: uid,
              type: "message",
              message: `New message from ${senderName}`,
              link: "/chat",
            });
          }
        }
      }
      if (notifications.length > 0) await sendNotifications(notifications);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to send";
      toast.error(msg);
      setInput(content);
      setPendingFiles(files);
      setReplyTo(reply);
    } finally {
      setUploading(false);
    }
  }

  async function handleReactionToggle(messageId: string, emoji: string) {
    if (!user) return;
    const has = reactions.some(
      (r) => r.message_id === messageId && r.user_id === user.id && r.emoji === emoji,
    );
    // optimistic
    if (has) {
      setReactions((prev) =>
        prev.filter(
          (r) => !(r.message_id === messageId && r.user_id === user.id && r.emoji === emoji),
        ),
      );
    } else {
      setReactions((prev) => [
        ...prev,
        { id: `tmp-${Math.random()}`, message_id: messageId, user_id: user.id, emoji },
      ]);
    }
    try {
      await toggleReaction(messageId, user.id, emoji, has);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Reaction failed");
    }
  }

  async function handleTogglePin(m: Message) {
    if (!user) return;
    try {
      await togglePinMessage(m.id, user.id, !m.pinned_at);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Pin failed");
    }
  }

  async function handleToggleStar(id: string) {
    if (!user) return;
    const has = starredIds.has(id);
    const next = new Set(starredIds);
    if (has) next.delete(id);
    else next.add(id);
    setStarredIds(next);
    try {
      await toggleStar(id, user.id, has);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Star failed");
      setStarredIds(starredIds);
    }
  }

  async function handleForwardTo(targetConvId: string) {
    if (!user || !forwardMessage) return;
    try {
      await sendMessage(
        targetConvId,
        user.id,
        forwardMessage.content,
        forwardMessage.attachments ?? [],
        {
          forwarded_from: forwardMessage.id,
        },
      );
      toast.success("Message forwarded");
      setForwardMessage(null);
      if (targetConvId !== activeId) setActiveId(targetConvId);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Forward failed");
    }
  }

  async function openStarredPanel() {
    if (!user) return;
    setShowStarredPanel(true);
    const msgs = await fetchMessagesByIds(Array.from(starredIds));
    setStarredMessages(msgs.slice().sort((a, b) => (a.created_at > b.created_at ? -1 : 1)));
  }

  // Voice recording
  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Microphone not supported");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const mr = new MediaRecorder(stream, { mimeType });
      recordChunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) recordChunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (recordTimerRef.current) {
          window.clearInterval(recordTimerRef.current);
          recordTimerRef.current = null;
        }
        const blob = new Blob(recordChunksRef.current, { type: mimeType });
        const ext = mimeType.includes("mp4") ? "m4a" : "webm";
        const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: mimeType });
        setPendingFiles((prev) => [...prev, file]);
        setRecording(false);
        setRecordSeconds(0);
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = window.setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } catch {
      toast.error("Could not access microphone");
    }
  }
  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }
  function cancelRecording() {
    const mr = mediaRecorderRef.current;
    if (mr) {
      recordChunksRef.current = [];
      mr.onstop = () => {
        mr.stream.getTracks().forEach((t) => t.stop());
      };
      mr.stop();
    }
    if (recordTimerRef.current) {
      window.clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setRecording(false);
    setRecordSeconds(0);
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const oversized = files.find((f) => f.size > 25 * 1024 * 1024);
    if (oversized) toast.error(`${oversized.name} is over 25MB`);
    setPendingFiles((prev) => [...prev, ...files.filter((f) => f.size <= 25 * 1024 * 1024)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function openDM(otherId: string) {
    if (!user) return;
    try {
      const id = await findOrCreateDM(user.id, otherId);
      await reloadConversations();
      setActiveId(id);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to open DM");
    }
  }

  function conversationLabel(c: Conversation): string {
    if (c.is_group) return c.name ?? "Group";
    const members = convMembers[c.id] ?? [];
    const other = members.find((m) => m !== user?.id);
    return other ? (teamById.get(other)?.full_name ?? "Direct message") : "Direct message";
  }
  function conversationAdmin(c: Conversation): boolean {
    if (c.is_group) return false;
    const members = convMembers[c.id] ?? [];
    const other = members.find((m) => m !== user?.id);
    return other ? teamById.get(other)?.role === "admin" : false;
  }
  function conversationBadge(c: Conversation): string | null {
    if (c.is_group) return null;
    const members = convMembers[c.id] ?? [];
    const other = members.find((m) => m !== user?.id);
    return other ? (teamById.get(other)?.badge ?? null) : null;
  }
  function otherUserId(c: Conversation): string | null {
    if (c.is_group) return null;
    return (convMembers[c.id] ?? []).find((m) => m !== user?.id) ?? null;
  }

  async function handleEditSave(id: string) {
    const text = editingText.trim();
    if (!text) {
      setEditingId(null);
      return;
    }
    try {
      await editMessage(id, text);
      setEditingId(null);
      setEditingText("");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to edit");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMessage(id);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  async function handleDeleteForMe(id: string) {
    try {
      await deleteMessageForMe(id);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to hide");
    }
  }

  async function handleLeaveGroup() {
    if (!user || !activeId) return;
    if (!confirm("Leave this group?")) return;
    try {
      await leaveConversation(activeId);
      setActiveId(null);
      await reloadConversations();
      toast.success("You left the group");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to leave");
    }
  }

  const activeConv = conversations.find((c) => c.id === activeId);
  const otherTeam = team.filter((m) => m.id !== user?.id);
  const q = search.trim().toLowerCase();
  const filteredConvs = conversations.filter(
    (c) => !q || conversationLabel(c).toLowerCase().includes(q),
  );
  const filteredTeam = otherTeam.filter(
    (m) =>
      !q || m.full_name.toLowerCase().includes(q) || (m.position ?? "").toLowerCase().includes(q),
  );
  const typingNames = Array.from(typingUsers)
    .map((id) => teamById.get(id)?.full_name?.split(" ")[0])
    .filter(Boolean) as string[];
  const dmOtherId = activeConv ? otherUserId(activeConv) : null;
  const dmIsOnline = dmOtherId ? onlineUsers.has(dmOtherId) : false;
  const inQ = inChatQuery.trim().toLowerCase();
  const visibleMessages = (
    inQ ? messages.filter((m) => m.content?.toLowerCase().includes(inQ)) : messages
  ).filter(
    (m) =>
      !user ||
      !(m as any).deleted_for ||
      !(((m as any).deleted_for as string[]) ?? []).includes(user.id),
  );
  const reactionsByMsg = useMemo(() => {
    const map: Record<string, Record<string, string[]>> = {};
    for (const r of reactions) {
      const byMsg = (map[r.message_id] ??= {});
      (byMsg[r.emoji] ??= []).push(r.user_id);
    }
    return map;
  }, [reactions]);
  const messageById = useMemo(() => new Map(messages.map((m) => [m.id, m])), [messages]);
  const otherMembers = activeConv
    ? (convMembers[activeConv.id] ?? []).filter((id) => id !== user?.id)
    : [];
  const allReadByOthers = (m: Message) => {
    if (otherMembers.length === 0) return false;
    return otherMembers.every((uid) => {
      const t = readByMap[uid];
      return t && t >= m.created_at;
    });
  };
  const fmtSec = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <>
      <div className="grid h-[100dvh] grid-cols-1 gap-0 overflow-hidden bg-card/60 md:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <div
          className={`flex flex-col overflow-hidden border-r border-border/60 bg-background/70 ${activeId ? "hidden md:flex" : "flex"}`}
        >
          <div className="space-y-3 border-b border-border/60 bg-white/70 p-4 text-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-brand-accent" />
                Conversations
              </div>
              <NewGroupDialog
                open={newGroupOpen}
                onOpenChange={setNewGroupOpen}
                team={otherTeam}
                onCreate={async (name, ids) => {
                  if (!user) return;
                  const id = await createGroup(user.id, name, ids);
                  await reloadConversations();
                  setActiveId(id);
                  setNewGroupOpen(false);
                  toast.success("Group created");
                }}
              />
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search people or groups"
                className="h-9 border-border/60 bg-background/80 pl-8 text-sm"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              <div className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Groups & DMs
              </div>
              {filteredConvs.length === 0 && (
                <div className="px-2 py-2 text-xs text-muted-foreground">No conversations yet.</div>
              )}
              {filteredConvs.map((c) => {
                const label = conversationLabel(c);
                const isActive = activeId === c.id;
                const unreadCount = unread[c.id] ?? 0;
                const otherId = otherUserId(c);
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`group mb-0.5 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-all hover:bg-accent/70 ${isActive ? "bg-gradient-to-r from-brand/10 to-brand-accent/10 ring-1 ring-brand/20" : ""}`}
                  >
                    <Avatar
                      name={label}
                      group={c.is_group}
                      admin={conversationAdmin(c)}
                      size={36}
                      online={!!(otherId && onlineUsers.has(otherId))}
                      url={otherId ? teamById.get(otherId)?.avatar_url : null}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`truncate ${unreadCount > 0 ? "font-semibold" : "font-medium"}`}
                        >
                          {label}
                        </span>
                        {mutes[c.id] && (
                          <BellOff className="h-3 w-3 shrink-0 text-muted-foreground" />
                        )}
                        {c.is_group && (
                          <Badge variant="outline" className="ml-auto text-[9px]">
                            group
                          </Badge>
                        )}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {c.is_group
                          ? `${(convMembers[c.id] ?? []).length} members`
                          : "Direct message"}
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <span className="ml-1 inline-flex min-w-[20px] items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
              <div className="px-2 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Start a DM
              </div>
              {filteredTeam.map((m) => {
                const dmConv = conversations.find((c) => !c.is_group && otherUserId(c) === m.id);
                const dmUnread = dmConv ? (unread[dmConv.id] ?? 0) : 0;
                return (
                  <button
                    key={m.id}
                    onClick={() => openDM(m.id)}
                    className="mb-0.5 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-all hover:bg-accent/70"
                  >
                    <div className="relative">
                      <Avatar
                        name={m.full_name}
                        admin={m.role === "admin"}
                        size={36}
                        url={m.avatar_url}
                        online={onlineUsers.has(m.id)}
                      />
                      {dmUnread > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5 items-center justify-center">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-background" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`truncate ${dmUnread > 0 ? "font-semibold" : "font-medium"}`}
                        >
                          {m.full_name}
                        </span>
                        {m.badge && <BadgePill label={m.badge} size="xs" />}
                        {m.role === "admin" && (
                          <Badge variant="outline" className="ml-auto text-[9px]">
                            admin
                          </Badge>
                        )}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">{m.position}</div>
                    </div>
                    {dmUnread > 0 && (
                      <span className="ml-1 inline-flex min-w-[20px] items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white">
                        {dmUnread > 99 ? "99+" : dmUnread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Thread */}
        <div
          className={`relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-background/70 ${activeId ? "flex" : "hidden md:flex"}`}
        >
          {activeConv ? (
            <>
              <div className="flex items-center gap-3 border-b border-border/60 bg-white/70 px-4 py-3 text-foreground">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setActiveId(null)}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Avatar
                  name={conversationLabel(activeConv)}
                  group={activeConv.is_group}
                  admin={conversationAdmin(activeConv)}
                  size={40}
                  online={!activeConv.is_group && dmIsOnline}
                  url={
                    !activeConv.is_group
                      ? teamById.get(otherUserId(activeConv) ?? "")?.avatar_url
                      : null
                  }
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">
                      {conversationLabel(activeConv)}
                    </span>
                    {conversationBadge(activeConv) && (
                      <BadgePill label={conversationBadge(activeConv)!} size="xs" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {activeConv.is_group ? (
                      <>
                        <Users className="h-3 w-3" />
                        {(convMembers[activeConv.id] ?? []).length} members
                        {onlineUsers.size > 0 && <span> · {onlineUsers.size} online</span>}
                      </>
                    ) : dmIsOnline ? (
                      <>
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                        Online now
                      </>
                    ) : (
                      <>
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Offline
                      </>
                    )}
                  </div>
                </div>
                {activeConv.is_group && user && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setManageOpen(true)}
                    aria-label="Manage group"
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                )}
                {user && (
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={mutes[activeConv.id] ? "Unmute" : "Mute"}
                    title={mutes[activeConv.id] ? "Unmute notifications" : "Mute notifications"}
                    onClick={async () => {
                      const next = !mutes[activeConv.id];
                      setMutes((m) => ({ ...m, [activeConv.id]: next }));
                      try {
                        await toggleMuteConversation(activeConv.id, next);
                      } catch (e: unknown) {
                        setMutes((m) => ({ ...m, [activeConv.id]: !next }));
                        toast.error(e instanceof Error ? e.message : "Failed");
                      }
                    }}
                  >
                    {mutes[activeConv.id] ? (
                      <BellOff className="h-4 w-4 text-amber-600" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setInChatSearch((v) => !v)}
                  aria-label="Search in chat"
                  className="hidden sm:inline-flex"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={openStarredPanel}
                  aria-label="Starred messages"
                  className="hidden sm:inline-flex"
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
              {inChatSearch && (
                <div className="border-b border-border/60 bg-white/60 px-4 py-2">
                  <Input
                    autoFocus
                    value={inChatQuery}
                    onChange={(e) => setInChatQuery(e.target.value)}
                    placeholder="Search in this conversation…"
                    className="h-9 bg-background/80"
                  />
                </div>
              )}
              {pinned.length > 0 && (
                <div className="border-b border-border/60 bg-amber-50/70 px-4 py-2">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                    <Pin className="h-3 w-3" /> Pinned ({pinned.length})
                  </div>
                  <div className="mt-1 flex gap-2 overflow-x-auto">
                    {pinned.slice(0, 5).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          const el = document.getElementById(`msg-${p.id}`);
                          el?.scrollIntoView({ behavior: "smooth", block: "center" });
                          el?.classList.add("ring-2", "ring-amber-400");
                          setTimeout(() => el?.classList.remove("ring-2", "ring-amber-400"), 1400);
                        }}
                        className="max-w-[240px] shrink-0 truncate rounded-md border border-amber-200 bg-white/80 px-2 py-1 text-left text-xs text-slate-700 hover:bg-white"
                      >
                        <span className="font-medium text-amber-700">
                          {teamById.get(p.sender_id)?.full_name?.split(" ")[0] ?? "Msg"}:
                        </span>{" "}
                        {p.deleted_at ? "(deleted)" : parseEffect(p.content).text || "(attachment)"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                aria-label="Conversation messages"
                className="flex-1 space-y-3 overflow-y-auto p-4"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 10%, rgba(59,130,246,0.06), transparent 40%), radial-gradient(circle at 80% 90%, rgba(15,27,61,0.05), transparent 45%)",
                }}
              >
                {hasMoreOlder && (
                  <div className="flex justify-center pb-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loadingOlder}
                      onClick={async () => {
                        if (!activeId || messages.length === 0) return;
                        setLoadingOlder(true);
                        try {
                          const older = await fetchOlderMessages(activeId, messages[0].created_at);
                          setMessages((prev) => [...older, ...prev]);
                          if (older.length < MESSAGES_PAGE_SIZE) setHasMoreOlder(false);
                        } finally {
                          setLoadingOlder(false);
                        }
                      }}
                    >
                      {loadingOlder ? "Loading…" : "Load older messages"}
                    </Button>
                  </div>
                )}
                {messages.length === 0 && (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    <MessageSquare className="mx-auto mb-2 h-8 w-8 opacity-40" />
                    No messages yet. Say hi 👋
                  </div>
                )}
                {visibleMessages.map((m, idx) => {
                  const mine = m.sender_id === user?.id;
                  const sender = teamById.get(m.sender_id);
                  const atts = m.attachments ?? [];
                  const prev = visibleMessages[idx - 1];
                  const showAvatar = !mine && (!prev || prev.sender_id !== m.sender_id);
                  const isDeleted = !!m.deleted_at;
                  const isEditing = editingId === m.id;
                  const parent = m.reply_to ? messageById.get(m.reply_to) : null;
                  const mentioned = user && m.mentions?.includes(user.id);
                  const { effect: fx, text: fxText } = parseEffect(m.content);
                  const linkUrl = !isDeleted && fxText ? extractFirstUrl(fxText) : null;
                  const rMap = reactionsByMsg[m.id] ?? {};
                  const rEntries = Object.entries(rMap);
                  const isStarred = starredIds.has(m.id);
                  const fxIcon = fx ? (MESSAGE_EFFECTS.find((e) => e.id === fx)?.icon ?? "") : "";
                  return (
                    <GestureWrapper
                      key={m.id}
                      onSwipeLeft={() => setReplyTo(m)}
                      onLongPress={() => {
                        const btn = document.querySelector(
                          `#msg-${m.id} .msg-react-btn`,
                        ) as HTMLButtonElement;
                        btn?.click();
                      }}
                      onTap={(e) => {
                        const target = e.target as HTMLElement;
                        if (
                          target.closest("button") ||
                          target.closest("a") ||
                          target.closest("input")
                        )
                          return;
                        const btn = document.querySelector(
                          `#msg-${m.id} .msg-options-btn`,
                        ) as HTMLButtonElement;
                        btn?.click();
                      }}
                    >
                      <div
                        id={`msg-${m.id}`}
                        className={`group/msg flex items-end gap-2 ${mine ? "justify-end" : "justify-start"} rounded-lg transition-shadow`}
                      >
                        {!mine && (
                          <div className="w-8">
                            {showAvatar && (
                              <Avatar
                                name={sender?.full_name ?? "?"}
                                admin={sender?.role === "admin"}
                                size={32}
                                url={sender?.avatar_url}
                              />
                            )}
                          </div>
                        )}
                        <div
                          className={`relative max-w-[75%] px-3.5 py-2 text-sm shadow-sm ${
                            mine
                              ? "rounded-2xl rounded-br-sm bg-gradient-to-br from-brand to-brand-accent text-white"
                              : "rounded-2xl rounded-bl-sm border border-border/60 bg-background"
                          } ${isDeleted ? "italic opacity-70" : ""} ${mentioned && !mine ? "ring-2 ring-amber-300" : ""} ${fx && !isDeleted ? `msg-fx msg-fx-${fx}` : ""}`}
                        >
                          {fx && !isDeleted && fxIcon && (
                            <span aria-hidden className="fx-layer">
                              {Array.from({ length: 8 }).map((_, i) => (
                                <span
                                  key={i}
                                  className="fx-p"
                                  style={{
                                    left: `${(i * 12 + 6) % 100}%`,
                                    animationDelay: `${(i * 0.3) % 2.4}s`,
                                    fontSize: `${12 + ((i * 3) % 10)}px`,
                                  }}
                                >
                                  {fxIcon}
                                </span>
                              ))}
                            </span>
                          )}

                          {!mine && activeConv.is_group && showAvatar && (
                            <div className="mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-brand-accent">
                              <span>{sender?.full_name ?? "Member"}</span>
                              {sender?.badge && <BadgePill label={sender.badge} size="xs" />}
                            </div>
                          )}

                          {m.pinned_at && !isDeleted && (
                            <div
                              className={`mb-1 flex items-center gap-1 text-[10px] font-semibold ${mine ? "text-white/80" : "text-amber-600"}`}
                            >
                              <Pin className="h-3 w-3" /> Pinned
                            </div>
                          )}
                          {m.forwarded_from && !isDeleted && (
                            <div
                              className={`mb-1 flex items-center gap-1 text-[10px] italic ${mine ? "text-white/80" : "text-muted-foreground"}`}
                            >
                              <Forward className="h-3 w-3" /> Forwarded
                            </div>
                          )}
                          {parent && (
                            <button
                              type="button"
                              onClick={() => {
                                const el = document.getElementById(`msg-${parent.id}`);
                                el?.scrollIntoView({ behavior: "smooth", block: "center" });
                                el?.classList.add("ring-2", "ring-brand-accent");
                                setTimeout(
                                  () => el?.classList.remove("ring-2", "ring-brand-accent"),
                                  1200,
                                );
                              }}
                              className={`mb-1 block w-full truncate rounded-md border-l-2 px-2 py-1 text-left text-[11px] ${mine ? "border-white/60 bg-white/10 text-white/90" : "border-brand-accent bg-brand-accent/5 text-slate-700"}`}
                            >
                              <span className="font-semibold">
                                {teamById.get(parent.sender_id)?.full_name?.split(" ")[0] ??
                                  "Reply"}
                                :{" "}
                              </span>
                              {parent.deleted_at
                                ? "(deleted)"
                                : parseEffect(parent.content).text || "(attachment)"}
                            </button>
                          )}

                          {isDeleted ? (
                            <div className="whitespace-pre-wrap break-words">
                              This message was deleted
                            </div>
                          ) : isEditing ? (
                            <div className="space-y-1">
                              <Input
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleEditSave(m.id);
                                  }
                                  if (e.key === "Escape") {
                                    setEditingId(null);
                                  }
                                }}
                                autoFocus
                                className="h-8 bg-white/90 text-slate-900"
                              />
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleEditSave(m.id)}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {atts.length > 0 && (
                                <div
                                  className={`mb-1 grid gap-1.5 ${atts.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
                                >
                                  {atts.map((a, i) => (
                                    <AttachmentView
                                      key={i}
                                      att={a}
                                      mine={mine}
                                      onOpenImage={setLightboxUrl}
                                    />
                                  ))}
                                </div>
                              )}
                              {fxText && (
                                <div className="whitespace-pre-wrap break-words">
                                  {renderContentWithMentions(fxText, team, mine)}
                                </div>
                              )}

                              {linkUrl && <LinkPreview url={linkUrl} mine={mine} />}
                            </>
                          )}

                          {rEntries.length > 0 && !isDeleted && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {rEntries.map(([emoji, users]) => {
                                const active = user ? users.includes(user.id) : false;
                                return (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => handleReactionToggle(m.id, emoji)}
                                    className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] transition-colors ${
                                      active
                                        ? "border-brand-accent bg-brand-accent/15 text-brand-accent"
                                        : mine
                                          ? "border-white/30 bg-white/15 text-white/90 hover:bg-white/25"
                                          : "border-border bg-muted/50 text-slate-700 hover:bg-muted"
                                    }`}
                                  >
                                    <span>{emoji}</span>
                                    <span>{users.length}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          <div
                            className={`mt-1 flex items-center gap-1 text-[10px] ${mine ? "text-white/70" : "text-muted-foreground"}`}
                          >
                            <span title={new Date(m.created_at).toLocaleString()}>
                              {formatRelative(m.created_at)}
                            </span>
                            {m.edited_at && !isDeleted && <span>· edited</span>}
                            {isStarred && <Star className="h-3 w-3 fill-current" />}
                            {mine &&
                              !isDeleted &&
                              (allReadByOthers(m) ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3 opacity-70" />
                              ))}
                          </div>

                          {!isDeleted && !isEditing && (
                            <div
                              className={`absolute -top-3 ${mine ? "right-1" : "left-1"} flex items-center gap-0.5 rounded-full bg-white/95 px-0.5 shadow ring-1 ring-black/5 opacity-0 transition-opacity group-hover/msg:opacity-100`}
                            >
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    className="msg-react-btn rounded-full p-1 text-slate-700 hover:bg-accent"
                                    aria-label="React"
                                  >
                                    <Smile className="h-3.5 w-3.5" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  side="top"
                                  align={mine ? "end" : "start"}
                                  className="w-auto p-1"
                                >
                                  <div className="flex gap-0.5">
                                    {QUICK_REACTIONS.map((emoji) => (
                                      <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => handleReactionToggle(m.id, emoji)}
                                        className="rounded-md p-1 text-lg hover:bg-accent"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <button
                                className="rounded-full p-1 text-slate-700 hover:bg-accent"
                                aria-label="Reply"
                                onClick={() => setReplyTo(m)}
                              >
                                <Reply className="h-3.5 w-3.5" />
                              </button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    className="msg-options-btn rounded-full p-1 text-slate-700 hover:bg-accent"
                                    aria-label="Message actions"
                                  >
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align={mine ? "end" : "start"}
                                  className="w-44"
                                >
                                  <DropdownMenuItem onSelect={() => setReplyTo(m)}>
                                    <Reply className="mr-2 h-3.5 w-3.5" /> Reply
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onSelect={() => handleToggleStar(m.id)}>
                                    <Star
                                      className={`mr-2 h-3.5 w-3.5 ${isStarred ? "fill-current text-amber-500" : ""}`}
                                    />{" "}
                                    {isStarred ? "Unstar" : "Star"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onSelect={() => handleTogglePin(m)}>
                                    {m.pinned_at ? (
                                      <>
                                        <PinOff className="mr-2 h-3.5 w-3.5" /> Unpin
                                      </>
                                    ) : (
                                      <>
                                        <Pin className="mr-2 h-3.5 w-3.5" /> Pin
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onSelect={() => setForwardMessage(m)}>
                                    <Forward className="mr-2 h-3.5 w-3.5" /> Forward
                                  </DropdownMenuItem>
                                  {fxText && (
                                    <DropdownMenuItem
                                      onSelect={() => {
                                        navigator.clipboard.writeText(fxText);
                                        toast.success("Copied");
                                      }}
                                    >
                                      <LinkIcon className="mr-2 h-3.5 w-3.5" /> Copy text
                                    </DropdownMenuItem>
                                  )}
                                  {mine && fxText && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onSelect={() => {
                                          setEditingId(m.id);
                                          setEditingText(fxText);
                                        }}
                                      >
                                        <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                                      </DropdownMenuItem>
                                    </>
                                  )}

                                  <DropdownMenuItem onSelect={() => handleDeleteForMe(m.id)}>
                                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete for me
                                  </DropdownMenuItem>
                                  {mine && (
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onSelect={() => handleDelete(m.id)}
                                    >
                                      <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete for everyone
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>
                      </div>
                    </GestureWrapper>
                  );
                })}
                {typingNames.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex gap-0.5">
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-accent"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-accent"
                        style={{ animationDelay: "120ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-accent"
                        style={{ animationDelay: "240ms" }}
                      />
                    </span>
                    <span>
                      {typingNames.slice(0, 2).join(", ")}
                      {typingNames.length > 2 ? ` +${typingNames.length - 2}` : ""} typing…
                    </span>
                  </div>
                )}
              </div>
              {replyTo && (
                <div className="flex items-start gap-2 border-t border-border/60 bg-brand-accent/5 px-3 py-2">
                  <Reply className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold text-brand-accent">
                      Replying to {teamById.get(replyTo.sender_id)?.full_name ?? "message"}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {replyTo.deleted_at
                        ? "(deleted)"
                        : parseEffect(replyTo.content).text || "(attachment)"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="rounded-full p-1 hover:bg-accent"
                    aria-label="Cancel reply"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {recording && (
                <div className="flex items-center gap-3 border-t border-border/60 bg-red-50 px-3 py-2 text-sm">
                  <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                  <span className="font-medium text-red-700">
                    Recording {fmtSec(recordSeconds)}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <Button size="sm" variant="ghost" onClick={cancelRecording}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={stopRecording}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <StopIcon className="mr-1 h-3.5 w-3.5" /> Stop
                    </Button>
                  </div>
                </div>
              )}
              {pendingFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-border/60 bg-muted/40 p-2">
                  {pendingFiles.map((f, i) => {
                    const isImg = f.type.startsWith("image/");
                    const isVid = f.type.startsWith("video/");
                    const isAud = f.type.startsWith("audio/");
                    return (
                      <div
                        key={i}
                        className="group relative flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5 text-xs shadow-sm"
                      >
                        {isImg ? (
                          <ImageIcon className="h-3.5 w-3.5 text-brand-accent" />
                        ) : isVid ? (
                          <Film className="h-3.5 w-3.5 text-brand-accent" />
                        ) : isAud ? (
                          <Mic className="h-3.5 w-3.5 text-brand-accent" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-brand-accent" />
                        )}
                        <span className="max-w-[160px] truncate">{f.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          className="rounded-full p-0.5 hover:bg-accent"
                          aria-label="Remove"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <form
                className="flex items-center gap-2 border-t border-border/60 bg-background/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                aria-label="Send a message"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.csv"
                  className="hidden"
                  onChange={onPickFiles}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || recording}
                  aria-label="Attach files"
                  className="rounded-full text-muted-foreground hover:text-brand"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <EmojiPicker
                  onPick={(emoji) => setInput((prev) => prev + emoji)}
                  disabled={uploading}
                />
                {profile?.badge === "Developer" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={uploading}
                        aria-label="Message effect"
                        title={
                          pendingEffect
                            ? `Effect: ${pendingEffect}`
                            : "Add message effect (dev only)"
                        }
                        className={`fx-picker-btn rounded-full ${pendingEffect ? "text-brand-accent" : "text-muted-foreground hover:text-brand"}`}
                      >
                        {pendingEffect ? (
                          <span className="text-base leading-none">
                            {MESSAGE_EFFECTS.find((e) => e.id === pendingEffect)?.icon}
                          </span>
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="start" className="w-64 p-2">
                      <div className="mb-1 flex items-center justify-between px-1">
                        <div className="text-xs font-semibold text-slate-700">
                          Developer effects
                        </div>
                        {pendingEffect && (
                          <button
                            type="button"
                            onClick={() => setPendingEffect(null)}
                            className="text-[10px] text-muted-foreground hover:text-destructive"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {MESSAGE_EFFECTS.map((e) => (
                          <button
                            key={e.id}
                            type="button"
                            onClick={() => setPendingEffect(e.id)}
                            className={`flex flex-col items-center gap-0.5 rounded-md p-2 text-[10px] transition hover:bg-accent ${pendingEffect === e.id ? "bg-brand-accent/10 ring-1 ring-brand-accent" : ""}`}
                            title={e.label}
                          >
                            <span className="text-xl leading-none">{e.icon}</span>
                            <span className="text-slate-700">{e.label}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-2 rounded-md bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground">
                        Preview: your next message bubble will animate with the chosen effect.
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={recording ? stopRecording : startRecording}
                  disabled={uploading}
                  aria-label={recording ? "Stop recording" : "Record voice"}
                  className={`rounded-full ${recording ? "text-red-600" : "text-muted-foreground hover:text-brand"}`}
                >
                  {recording ? <StopIcon className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <Input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    broadcastTyping();
                  }}
                  placeholder={
                    uploading
                      ? "Uploading…"
                      : recording
                        ? "Recording…"
                        : "Type a message… (use @ to mention)"
                  }
                  autoFocus
                  disabled={uploading}
                  aria-label="Message"
                  className="h-11 rounded-full border-border/70 bg-muted/40 px-4 text-base sm:text-sm focus-visible:ring-brand/40"
                />
                <Button
                  type="submit"
                  disabled={uploading || recording || (!input.trim() && pendingFiles.length === 0)}
                  aria-label="Send message"
                  className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-brand to-brand-accent p-0 shadow-md hover:opacity-95"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div className="max-w-xs">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-accent text-white shadow-lg">
                  <MessageSquare className="h-7 w-7" />
                </div>
                <div className="font-display text-lg font-semibold">
                  Your conversations live here
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select a chat from the left or start a new group to get talking with your team.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {activeConv?.is_group && user && (
        <ManageGroupDialog
          open={manageOpen}
          onOpenChange={setManageOpen}
          conversation={activeConv}
          memberIds={convMembers[activeConv.id] ?? []}
          team={team}
          currentUserId={user.id}
          onChanged={reloadConversations}
          onLeave={handleLeaveGroup}
        />
      )}
      {forwardMessage && user && (
        <Dialog
          open={!!forwardMessage}
          onOpenChange={(v) => {
            if (!v) setForwardMessage(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Forward message</DialogTitle>
            </DialogHeader>
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleForwardTo(c.id)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                >
                  <Avatar
                    name={conversationLabel(c)}
                    group={c.is_group}
                    admin={conversationAdmin(c)}
                    size={28}
                    url={otherUserId(c) ? teamById.get(otherUserId(c) ?? "")?.avatar_url : null}
                  />
                  <span className="flex-1 truncate">{conversationLabel(c)}</span>
                  {c.is_group && (
                    <Badge variant="outline" className="text-[9px]">
                      group
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={showStarredPanel} onOpenChange={setShowStarredPanel}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Starred messages</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {starredMessages.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No starred messages yet.
              </div>
            )}
            {starredMessages.map((m) => (
              <div key={m.id} className="rounded-md border border-border bg-muted/30 p-2 text-sm">
                <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-semibold text-slate-700">
                    {teamById.get(m.sender_id)?.full_name ?? "Member"}
                  </span>
                  <span title={new Date(m.created_at).toLocaleString()}>
                    {formatRelative(m.created_at)}
                  </span>
                </div>
                <div className="whitespace-pre-wrap break-words">
                  {m.deleted_at ? <em>(deleted)</em> : m.content || <em>(attachment)</em>}
                </div>
                <div className="mt-1 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setActiveId(m.conversation_id);
                      setShowStarredPanel(false);
                      setTimeout(
                        () =>
                          document
                            .getElementById(`msg-${m.id}`)
                            ?.scrollIntoView({ behavior: "smooth", block: "center" }),
                        400,
                      );
                    }}
                  >
                    Go to message
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleToggleStar(m.id)}>
                    <Star className="mr-1 h-3.5 w-3.5 fill-current text-amber-500" /> Unstar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxUrl(null);
            }}
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightboxUrl}
            alt="Full view"
            className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <a
            href={lightboxUrl}
            download
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Open in new tab
          </a>
        </div>
      )}
    </>
  );
}

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥"];

function renderContentWithMentions(text: string, team: TeamMember[], mine: boolean) {
  const parts: React.ReactNode[] = [];
  const re = /@([\p{L}][\p{L}0-9._-]{1,40})/gu;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text))) {
    if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
    const token = match[1].toLowerCase();
    const hit = team.find((t) => {
      const first = (t.full_name.split(" ")[0] ?? "").toLowerCase();
      const full = t.full_name.toLowerCase().replace(/\s+/g, "");
      return token === first || token === full;
    });
    if (hit) {
      parts.push(
        <span
          key={`m-${key++}`}
          className={`rounded px-1 font-semibold ${mine ? "bg-white/25 text-white" : "bg-brand-accent/15 text-brand-accent"}`}
        >
          @{hit.full_name.split(" ")[0]}
        </span>,
      );
    } else {
      parts.push(match[0]);
    }
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return <>{parts}</>;
}

function LinkPreview({ url, mine }: { url: string; mine: boolean }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`mt-1.5 flex items-center gap-2 rounded-md border px-2 py-1.5 text-[11px] transition-colors ${
        mine
          ? "border-white/30 bg-white/10 text-white/90 hover:bg-white/20"
          : "border-border bg-muted/40 text-slate-700 hover:bg-muted"
      }`}
    >
      <LinkIcon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{url}</span>
    </a>
  );
}

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: "Smileys",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "🙃",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "🤩",
      "😘",
      "😗",
      "😚",
      "😙",
      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🤗",
      "🤭",
      "🤫",
      "🤔",
      "😐",
      "😑",
      "😶",
      "😏",
      "😒",
      "🙄",
      "😬",
      "😮",
      "😯",
      "😲",
      "😳",
      "🥺",
      "😢",
      "😭",
      "😤",
      "😠",
      "😡",
      "🤬",
      "😴",
      "🤤",
      "🤯",
      "😎",
      "🥳",
      "🤝",
      "🙏",
    ],
  },
  {
    label: "Gestures",
    emojis: [
      "👍",
      "👎",
      "👌",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "👇",
      "☝️",
      "✋",
      "🤚",
      "🖐️",
      "🖖",
      "👋",
      "🤏",
      "💪",
      "🙌",
      "👏",
      "🫶",
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "💯",
      "🔥",
      "⭐",
      "✨",
      "🎉",
      "🎊",
      "🎁",
      "💎",
      "💡",
      "✅",
      "❌",
      "⚠️",
      "❓",
      "❗",
    ],
  },
  {
    label: "Work",
    emojis: [
      "💻",
      "🖥️",
      "⌨️",
      "🖱️",
      "📱",
      "📞",
      "☎️",
      "📧",
      "📨",
      "📩",
      "📤",
      "📥",
      "📎",
      "📌",
      "📍",
      "📝",
      "✏️",
      "📊",
      "📈",
      "📉",
      "📅",
      "📆",
      "🗓️",
      "⏰",
      "⏳",
      "⌛",
      "🔔",
      "🔕",
      "🔒",
      "🔓",
      "🔑",
      "💼",
      "🗂️",
      "📁",
      "📂",
      "🧠",
      "☕",
      "🍕",
      "🍔",
      "🚀",
    ],
  },
];

function GestureWrapper({
  children,
  onSwipeLeft,
  onLongPress,
  onTap,
}: {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onLongPress: () => void;
  onTap: (e: React.PointerEvent) => void;
}) {
  const [translateX, setTranslateX] = useState(0);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const isSwiping = useRef(false);
  const isLongPressTriggered = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    startTime.current = Date.now();
    isSwiping.current = false;
    isLongPressTriggered.current = false;

    timerRef.current = window.setTimeout(() => {
      isLongPressTriggered.current = true;
      onLongPress();
    }, 500);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startX.current === null || startY.current === null) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    if (!isSwiping.current && dx < -10 && Math.abs(dx) > Math.abs(dy)) {
      isSwiping.current = true;
    }

    if (isSwiping.current && dx < 0) {
      setTranslateX(Math.max(-60, dx));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (startX.current !== null && startTime.current !== null) {
      const dx = e.clientX - startX.current;
      const dy = e.clientY - (startY.current ?? e.clientY);
      const dt = Date.now() - startTime.current;

      if (isSwiping.current && dx < -40) {
        onSwipeLeft();
      } else if (
        !isSwiping.current &&
        !isLongPressTriggered.current &&
        Math.abs(dx) < 10 &&
        Math.abs(dy) < 10 &&
        dt < 500
      ) {
        onTap(e);
      }
    }

    startX.current = null;
    startY.current = null;
    startTime.current = null;
    isSwiping.current = false;
    isLongPressTriggered.current = false;
    setTranslateX(0);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={(e) => {
        if (window.matchMedia("(max-width: 768px)").matches) {
          e.preventDefault();
        }
      }}
      style={{ transform: `translateX(${translateX}px)` }}
      className="transition-transform duration-200 ease-out will-change-transform touch-pan-y"
    >
      {children}
    </div>
  );
}

function EmojiPicker({
  onPick,
  disabled,
}: {
  onPick: (emoji: string) => void;
  disabled?: boolean;
}) {
  const [tab, setTab] = useState(0);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          aria-label="Insert emoji"
          className="rounded-full text-muted-foreground hover:text-brand"
        >
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="top" className="w-72 p-2">
        <div className="mb-2 flex gap-1">
          {EMOJI_GROUPS.map((g, i) => (
            <button
              key={g.label}
              type="button"
              onClick={() => setTab(i)}
              className={`flex-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${tab === i ? "bg-brand/10 text-brand" : "text-muted-foreground hover:bg-accent"}`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="grid max-h-56 grid-cols-8 gap-1 overflow-y-auto">
          {EMOJI_GROUPS[tab].emojis.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => onPick(e)}
              className="rounded-md p-1 text-xl leading-none transition-transform hover:scale-110 hover:bg-accent"
            >
              {e}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NewGroupDialog({
  open,
  onOpenChange,
  team,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  team: TeamMember[];
  onCreate: (name: string, ids: string[]) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setName("");
          setSelected(new Set());
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-8 rounded-full border border-white/30 bg-white/15 px-3 text-white hover:bg-white/25"
        >
          <Plus className="mr-1 h-3 w-3" /> Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Group name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marketing squad"
            />
          </div>
          <div className="space-y-2">
            <Label>Members</Label>
            <div className="max-h-56 space-y-1 overflow-y-auto rounded-md border border-border p-2">
              {team.map((m) => (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <Checkbox
                    checked={selected.has(m.id)}
                    onCheckedChange={(v) => {
                      const next = new Set(selected);
                      if (v) next.add(m.id);
                      else next.delete(m.id);
                      setSelected(next);
                    }}
                  />
                  <span className="flex-1">
                    {m.full_name}{" "}
                    <span className="text-xs text-muted-foreground">— {m.position}</span>
                  </span>
                  {m.role === "admin" && (
                    <Badge variant="outline" className="text-[10px]">
                      admin
                    </Badge>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!name.trim() || selected.size === 0 || busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onCreate(name.trim(), Array.from(selected));
              } finally {
                setBusy(false);
              }
            }}
          >
            Create group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ManageGroupDialog({
  open,
  onOpenChange,
  conversation,
  memberIds,
  team,
  currentUserId,
  onChanged,
  onLeave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  conversation: Conversation;
  memberIds: string[];
  team: TeamMember[];
  currentUserId: string;
  onChanged: () => Promise<void> | void;
  onLeave: () => void;
}) {
  const [name, setName] = useState(conversation.name ?? "");
  const [toAdd, setToAdd] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const isCreator = conversation.created_by === currentUserId;

  useEffect(() => {
    if (open) {
      setName(conversation.name ?? "");
      setToAdd(new Set());
    }
  }, [open, conversation.id, conversation.name]);

  const memberSet = new Set(memberIds);
  const currentMembers = team.filter((m) => memberSet.has(m.id));
  const nonMembers = team.filter((m) => !memberSet.has(m.id));

  async function saveName() {
    if (!name.trim() || name.trim() === (conversation.name ?? "")) return;
    setBusy(true);
    try {
      await renameGroup(conversation.id, name.trim());
      await onChanged();
      toast.success("Group renamed");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Rename failed");
    } finally {
      setBusy(false);
    }
  }

  async function addSelected() {
    if (toAdd.size === 0) return;
    setBusy(true);
    try {
      await addGroupMembers(conversation.id, Array.from(toAdd));
      setToAdd(new Set());
      await onChanged();
      toast.success("Members added");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to add");
    } finally {
      setBusy(false);
    }
  }

  async function removeMember(uid: string) {
    if (!confirm("Remove this member from the group?")) return;
    setBusy(true);
    try {
      await removeGroupMember(conversation.id, uid);
      await onChanged();
      toast.success("Member removed");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to remove");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage group</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Group name</Label>
            <div className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isCreator || busy}
              />
              {isCreator && (
                <Button
                  onClick={saveName}
                  disabled={busy || !name.trim() || name.trim() === (conversation.name ?? "")}
                >
                  <Check className="mr-1 h-4 w-4" /> Save
                </Button>
              )}
            </div>
            {!isCreator && (
              <p className="text-xs text-muted-foreground">
                Only the creator can rename this group.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Members ({currentMembers.length})</Label>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-border p-2">
              {currentMembers.map((m) => (
                <div key={m.id} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm">
                  <span className="flex-1">
                    {m.full_name}{" "}
                    <span className="text-xs text-muted-foreground">— {m.position}</span>
                    {m.id === conversation.created_by && (
                      <Badge variant="outline" className="ml-2 text-[9px]">
                        creator
                      </Badge>
                    )}
                  </span>
                  {isCreator && m.id !== currentUserId && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeMember(m.id)}
                      disabled={busy}
                      aria-label="Remove member"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {nonMembers.length > 0 && (
            <div className="space-y-2">
              <Label>Add members</Label>
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-border p-2">
                {nonMembers.map((m) => (
                  <label
                    key={m.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <Checkbox
                      checked={toAdd.has(m.id)}
                      onCheckedChange={(v) => {
                        const next = new Set(toAdd);
                        if (v) next.add(m.id);
                        else next.delete(m.id);
                        setToAdd(next);
                      }}
                    />
                    <span className="flex-1">
                      {m.full_name}{" "}
                      <span className="text-xs text-muted-foreground">— {m.position}</span>
                    </span>
                  </label>
                ))}
              </div>
              <Button size="sm" onClick={addSelected} disabled={busy || toAdd.size === 0}>
                <UserPlus className="mr-1 h-4 w-4" /> Add {toAdd.size > 0 ? `(${toAdd.size})` : ""}
              </Button>
            </div>
          )}
        </div>
        <DialogFooter className="justify-between sm:justify-between">
          <Button variant="destructive" onClick={onLeave} disabled={busy}>
            <LogOut className="mr-1 h-4 w-4" /> Leave group
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AttachmentView({
  att,
  mine,
  onOpenImage,
}: {
  att: ChatAttachment;
  mine: boolean;
  onOpenImage?: (url: string) => void;
}) {
  const url = att.url;
  if (att.kind === "image") {
    return (
      <button
        type="button"
        onClick={() => onOpenImage?.(url)}
        className="block overflow-hidden rounded-lg"
      >
        <img
          src={url}
          alt={att.name}
          className="max-h-64 w-full cursor-zoom-in object-cover transition-transform hover:scale-[1.01]"
          loading="lazy"
        />
      </button>
    );
  }
  if (att.kind === "video") {
    return <video src={url} controls className="max-h-64 w-full rounded-lg bg-black" />;
  }
  if (att.kind === "audio") {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg px-2.5 py-2 ${mine ? "bg-white/10" : "bg-muted/40"}`}
      >
        <Mic className={`h-4 w-4 shrink-0 ${mine ? "text-white/80" : "text-brand-accent"}`} />
        <audio src={url} controls className="h-8 w-full max-w-[220px]" />
      </div>
    );
  }
  const isPdf =
    att.kind === "file" &&
    (att.name.toLowerCase().endsWith(".pdf") ||
      (att as unknown as { mime?: string }).mime === "application/pdf");
  if (isPdf) {
    return (
      <div
        className={`overflow-hidden rounded-lg border ${mine ? "border-white/30 bg-white/10" : "border-border bg-background"}`}
      >
        <object data={url} type="application/pdf" className="h-64 w-full">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 p-2 text-xs underline"
          >
            <FileText className="h-4 w-4" /> {att.name}
          </a>
        </object>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          download={att.name}
          className={`flex items-center gap-2 border-t px-2.5 py-1.5 text-xs ${mine ? "border-white/20" : "border-border"}`}
        >
          <FileText className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0 flex-1 truncate">{att.name}</span>
          <span className="opacity-70">{(att.size / 1024).toFixed(0)} KB</span>
        </a>
      </div>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      download={att.name}
      className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs ${mine ? "border-white/30 bg-white/10" : "border-border bg-background"}`}
    >
      <FileText className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{att.name}</span>
      <span className="opacity-70">{(att.size / 1024).toFixed(0)} KB</span>
    </a>
  );
}
