import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "@clerk/tanstack-start/server";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

function getReqOrThrow() {
  const req = getRequest();
  if (!req) throw new Error("No request");
  return req;
}

async function getAuthOrThrow(req: Request) {
  const auth = await getAuth(req);
  if (!auth.userId) throw new Error("Unauthorized");
  return auth;
}

export const fetchMyConversations = createServerFn({ method: "GET" }).handler(async () => {
  const auth = await getAuthOrThrow(getReqOrThrow());
  const memberships = await prisma.conversationMember.findMany({
    where: { user_id: auth.userId },
    select: { conversation_id: true },
  });
  const ids = memberships.map((m) => m.conversation_id);
  if (ids.length === 0) return [];
  const conversations = await prisma.conversation.findMany({
    where: { id: { in: ids } },
    orderBy: { created_at: "desc" },
  });
  return conversations;
});

export const fetchConversationMembers = createServerFn({ method: "GET" })
  .validator((conversationId: string) => conversationId)
  .handler(async ({ data: conversationId }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    const members = await prisma.conversationMember.findMany({
      where: { conversation_id: conversationId },
      select: { user_id: true },
    });
    return members.map((r) => r.user_id);
  });

export const fetchMessages = createServerFn({ method: "GET" })
  .validator((data: { conversationId: string; limit: number }) => data)
  .handler(async ({ data: { conversationId, limit } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    const messages = await prisma.message.findMany({
      where: { conversation_id: conversationId },
      orderBy: { created_at: "desc" },
      take: limit,
    });
    return messages.slice().reverse();
  });

export const fetchOlderMessages = createServerFn({ method: "GET" })
  .validator((data: { conversationId: string; beforeIso: string; limit: number }) => data)
  .handler(async ({ data: { conversationId, beforeIso, limit } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    const messages = await prisma.message.findMany({
      where: {
        conversation_id: conversationId,
        created_at: { lt: new Date(beforeIso) },
      },
      orderBy: { created_at: "desc" },
      take: limit,
    });
    return messages.slice().reverse();
  });

export const fetchMessagesByIds = createServerFn({ method: "GET" })
  .validator((ids: string[]) => ids)
  .handler(async ({ data: ids }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    if (ids.length === 0) return [];
    return await prisma.message.findMany({
      where: { id: { in: ids } },
    });
  });

export const sendMessage = createServerFn({ method: "POST" })
  .validator(
    (data: {
      conversationId: string;
      content: string;
      attachments: any[];
      replyTo?: string | null;
      forwardedFrom?: string | null;
      mentions?: string[];
    }) => data,
  )
  .handler(
    async ({
      data: { conversationId, content, attachments, replyTo, forwardedFrom, mentions },
    }) => {
      const auth = await getAuthOrThrow(getReqOrThrow());

      // Convert undefined to null for Prisma JSON or fields
      const newMsg = await prisma.message.create({
        data: {
          conversation_id: conversationId,
          sender_id: auth.userId,
          content,
          attachments: attachments ?? [],
          reply_to: replyTo ?? null,
          forwarded_from: forwardedFrom ?? null,
          mentions: mentions ?? [],
        },
      });

      // NOTE: Push notifications using OneSignal can be handled here on the server
      try {
        const appId = process.env.VITE_ONESIGNAL_APP_ID;
        const apiKey = process.env.VITE_ONESIGNAL_API_KEY;
        if (appId && apiKey) {
          const members = await prisma.conversationMember.findMany({
            where: { conversation_id: conversationId, user_id: { not: auth.userId } },
            select: { user_id: true },
          });
          const targetIds = members.map((m) => m.user_id);

          if (targetIds.length > 0) {
            const profile = await prisma.profile.findUnique({ where: { id: auth.userId } });
            const senderName = profile?.full_name || "Someone";

            await fetch("https://onesignal.com/api/v1/notifications", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${apiKey}`,
              },
              body: JSON.stringify({
                app_id: appId,
                include_aliases: {
                  external_id: targetIds,
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

      return newMsg;
    },
  );

export const uploadChatAttachment = createServerFn({ method: "POST" })
  .validator(
    (data: { conversationId: string; fileBase64: string; fileName: string; mimeType: string }) =>
      data,
  )
  .handler(async ({ data: { conversationId, fileBase64, fileName, mimeType } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());

    const buffer = Buffer.from(fileBase64, "base64");
    const path = `${conversationId}/${auth.userId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${fileName}`;

    const blob = await put(path, buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const kind = mimeType.startsWith("image/")
      ? "image"
      : mimeType.startsWith("video/")
        ? "video"
        : mimeType.startsWith("audio/")
          ? "audio"
          : "file";

    return {
      path,
      url: blob.url,
      name: fileName,
      type: mimeType,
      size: buffer.length,
      kind,
    };
  });

export const findOrCreateDM = createServerFn({ method: "POST" })
  .validator((otherUserId: string) => otherUserId)
  .handler(async ({ data: otherUserId }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    const currentUserId = auth.userId;

    const mine = await prisma.conversationMember.findMany({
      where: { user_id: currentUserId },
      include: { conversation: true },
    });

    const dmIds = mine
      .filter((m) => m.conversation.is_group === false)
      .map((m) => m.conversation_id);
    if (dmIds.length > 0) {
      const match = await prisma.conversationMember.findFirst({
        where: { user_id: otherUserId, conversation_id: { in: dmIds } },
      });
      if (match) return match.conversation_id;
    }

    const conv = await prisma.conversation.create({
      data: { is_group: false, name: null },
    });

    await prisma.conversationMember.createMany({
      data: [
        { conversation_id: conv.id, user_id: currentUserId },
        { conversation_id: conv.id, user_id: otherUserId },
      ],
    });

    return conv.id;
  });

export const createGroup = createServerFn({ method: "POST" })
  .validator((data: { name: string; memberIds: string[] }) => data)
  .handler(async ({ data: { name, memberIds } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    const conv = await prisma.conversation.create({
      data: { is_group: true, name },
    });

    const ids = Array.from(new Set([auth.userId, ...memberIds]));
    await prisma.conversationMember.createMany({
      data: ids.map((id) => ({ conversation_id: conv.id, user_id: id })),
    });
    return conv.id;
  });

export const editMessage = createServerFn({ method: "POST" })
  .validator((data: { messageId: string; content: string }) => data)
  .handler(async ({ data: { messageId, content } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.message.update({
      where: { id: messageId },
      data: { content, edited_at: new Date() },
    });
    return true;
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .validator((messageId: string) => messageId)
  .handler(async ({ data: messageId }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.message.update({
      where: { id: messageId },
      data: { content: "", attachments: [], deleted_at: new Date() },
    });
    return true;
  });

export const deleteMessageForMe = createServerFn({ method: "POST" })
  .validator((messageId: string) => messageId)
  .handler(async ({ data: messageId }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    try {
      await (prisma as any).hiddenMessage.create({
        data: { message_id: messageId, user_id: auth.userId },
      });
    } catch {
      /* ignore */
    }
    return true;
  });

export const leaveConversation = createServerFn({ method: "POST" })
  .validator((conversationId: string) => conversationId)
  .handler(async ({ data: conversationId }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.conversationMember.deleteMany({
      where: { conversation_id: conversationId, user_id: auth.userId },
    });
    return true;
  });

export const toggleMuteConversation = createServerFn({ method: "POST" })
  .validator((data: { conversationId: string; mute: boolean }) => data)
  .handler(async ({ data: { conversationId, mute } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    const members = await prisma.conversationMember.findMany({
      where: { conversation_id: conversationId, user_id: auth.userId },
    });
    if (members.length > 0) {
      await prisma.conversationMember.updateMany({
        where: { conversation_id: conversationId, user_id: auth.userId },
        data: { muted_at: mute ? new Date() : null },
      });
    }
    return true;
  });

export const fetchMuteMap = createServerFn({ method: "GET" }).handler(async () => {
  const auth = await getAuthOrThrow(getReqOrThrow());
  const memberships = await prisma.conversationMember.findMany({
    where: { user_id: auth.userId },
    select: { conversation_id: true, muted_at: true },
  });
  const map: Record<string, boolean> = {};
  for (const r of memberships) map[r.conversation_id] = Boolean(r.muted_at);
  return map;
});

export const togglePinMessage = createServerFn({ method: "POST" })
  .validator((data: { messageId: string; pinned: boolean }) => data)
  .handler(async ({ data: { messageId, pinned } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.message.update({
      where: { id: messageId },
      data: {
        pinned_at: pinned ? new Date() : null,
        pinned_by: pinned ? auth.userId : null,
      },
    });
    return true;
  });

export const fetchPinnedMessages = createServerFn({ method: "GET" })
  .validator((conversationId: string) => conversationId)
  .handler(async ({ data: conversationId }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    return await prisma.message.findMany({
      where: { conversation_id: conversationId, pinned_at: { not: null } },
      orderBy: { pinned_at: "desc" },
    });
  });

export const fetchReactions = createServerFn({ method: "GET" })
  .validator((conversationId: string) => conversationId)
  .handler(async ({ data: conversationId }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    const msgs = await prisma.message.findMany({
      where: { conversation_id: conversationId },
      select: { id: true },
    });
    const ids = msgs.map((m) => m.id);
    if (ids.length === 0) return [];
    return await prisma.messageReaction.findMany({
      where: { message_id: { in: ids } },
    });
  });

export const toggleReaction = createServerFn({ method: "POST" })
  .validator((data: { messageId: string; emoji: string; has: boolean }) => data)
  .handler(async ({ data: { messageId, emoji, has } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    if (has) {
      await prisma.messageReaction.deleteMany({
        where: { message_id: messageId, user_id: auth.userId, emoji },
      });
    } else {
      await prisma.messageReaction.create({
        data: { message_id: messageId, user_id: auth.userId, emoji },
      });
    }
    return true;
  });

export const fetchStarredIds = createServerFn({ method: "GET" }).handler(async () => {
  const auth = await getAuthOrThrow(getReqOrThrow());
  const starred = await prisma.starredMessage.findMany({
    where: { user_id: auth.userId },
    select: { message_id: true },
  });
  return starred.map((s) => s.message_id);
});

export const toggleStar = createServerFn({ method: "POST" })
  .validator((data: { messageId: string; starred: boolean }) => data)
  .handler(async ({ data: { messageId, starred } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    if (starred) {
      await prisma.starredMessage.deleteMany({
        where: { message_id: messageId, user_id: auth.userId },
      });
    } else {
      await prisma.starredMessage.create({
        data: { message_id: messageId, user_id: auth.userId },
      });
    }
    return true;
  });

export const markConversationRead = createServerFn({ method: "POST" })
  .validator((conversationId: string) => conversationId)
  .handler(async ({ data: conversationId }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.conversationMember.updateMany({
      where: { conversation_id: conversationId, user_id: auth.userId },
      data: { last_read_at: new Date() },
    });
    return true;
  });

export const fetchLastReadMap = createServerFn({ method: "GET" }).handler(async () => {
  const auth = await getAuthOrThrow(getReqOrThrow());
  const memberships = await prisma.conversationMember.findMany({
    where: { user_id: auth.userId },
    select: { conversation_id: true, last_read_at: true },
  });
  const map: Record<string, string> = {};
  for (const r of memberships) {
    if (r.last_read_at) map[r.conversation_id] = (r.last_read_at as Date).toISOString();
  }
  return map;
});

export const fetchLastReadByMembers = createServerFn({ method: "GET" })
  .validator((conversationId: string) => conversationId)
  .handler(async ({ data: conversationId }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    const memberships = await prisma.conversationMember.findMany({
      where: { conversation_id: conversationId },
      select: { user_id: true, last_read_at: true },
    });
    const map: Record<string, string> = {};
    for (const r of memberships) {
      if (r.last_read_at) map[r.user_id] = (r.last_read_at as Date).toISOString();
    }
    return map;
  });

export const fetchUnreadCounts = createServerFn({ method: "POST" })
  .validator((data: { conversationIds: string[]; lastRead: Record<string, string> }) => data)
  .handler(async ({ data: { conversationIds, lastRead } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    const result: Record<string, number> = {};
    await Promise.all(
      conversationIds.map(async (cid) => {
        const since = lastRead[cid] ? new Date(lastRead[cid]) : new Date(0);
        const count = await prisma.message.count({
          where: {
            conversation_id: cid,
            sender_id: { not: auth.userId },
            created_at: { gt: since },
          },
        });
        result[cid] = count;
      }),
    );
    return result;
  });

export const renameGroup = createServerFn({ method: "POST" })
  .validator((data: { conversationId: string; name: string }) => data)
  .handler(async ({ data: { conversationId, name } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { name },
    });
    return true;
  });

export const addGroupMembers = createServerFn({ method: "POST" })
  .validator((data: { conversationId: string; userIds: string[] }) => data)
  .handler(async ({ data: { conversationId, userIds } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    if (userIds.length === 0) return true;
    await prisma.conversationMember.createMany({
      data: userIds.map((id) => ({ conversation_id: conversationId, user_id: id })),
      skipDuplicates: true,
    });
    return true;
  });

export const removeGroupMember = createServerFn({ method: "POST" })
  .validator((data: { conversationId: string; userId: string }) => data)
  .handler(async ({ data: { conversationId, userId } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.conversationMember.deleteMany({
      where: { conversation_id: conversationId, user_id: userId },
    });
    return true;
  });
