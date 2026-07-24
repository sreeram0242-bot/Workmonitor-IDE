import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { n as createServerRpc, t as auth } from "./auth-CLHUWdtF.mjs";
import { t as broadcast } from "./ably.functions-Zufw-W-F.mjs";
import { t as prisma } from "./prisma-B-Q1fYN8.mjs";
import { t as require_cloudinary } from "../_libs/cloudinary+lodash.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat.functions-C9u3jGfs.js
var import_cloudinary = /* @__PURE__ */ __toESM(require_cloudinary());
async function getAuthOrThrow() {
	const authResult = await auth();
	if (!authResult.userId) throw new Error("Unauthorized");
	return authResult;
}
var fetchMyConversations_createServerFn_handler = createServerRpc({
	id: "55ece5e0c70b33f4832368023066a0bd0402e31a8c455732eaf820e5f4937bf4",
	name: "fetchMyConversations",
	filename: "src/lib/chat.functions.ts"
}, (opts) => fetchMyConversations.__executeServer(opts));
var fetchMyConversations = createServerFn({ method: "GET" }).handler(fetchMyConversations_createServerFn_handler, async () => {
	const authResult = await getAuthOrThrow();
	const ids = (await prisma.conversationMember.findMany({
		where: { user_id: authResult.userId },
		select: { conversation_id: true }
	})).map((m) => m.conversation_id);
	if (ids.length === 0) return [];
	return await prisma.conversation.findMany({
		where: { id: { in: ids } },
		orderBy: { created_at: "desc" }
	});
});
var fetchConversationMembers_createServerFn_handler = createServerRpc({
	id: "02461e5d7c054a54852b86bce37fb5b00a83db5050c0aeb902d971166830154b",
	name: "fetchConversationMembers",
	filename: "src/lib/chat.functions.ts"
}, (opts) => fetchConversationMembers.__executeServer(opts));
var fetchConversationMembers = createServerFn({ method: "GET" }).validator((conversationId) => conversationId).handler(fetchConversationMembers_createServerFn_handler, async ({ data: conversationId }) => {
	await getAuthOrThrow();
	return (await prisma.conversationMember.findMany({
		where: { conversation_id: conversationId },
		select: { user_id: true }
	})).map((r) => r.user_id);
});
var fetchMessages_createServerFn_handler = createServerRpc({
	id: "9976442668355f38cb1edff0bc78908426a4aa972d4fbcbd4ba4579414b97c63",
	name: "fetchMessages",
	filename: "src/lib/chat.functions.ts"
}, (opts) => fetchMessages.__executeServer(opts));
var fetchMessages = createServerFn({ method: "GET" }).validator((data) => data).handler(fetchMessages_createServerFn_handler, async ({ data: { conversationId, limit } }) => {
	await getAuthOrThrow();
	return (await prisma.message.findMany({
		where: { conversation_id: conversationId },
		orderBy: { created_at: "desc" },
		take: limit
	})).slice().reverse();
});
var fetchOlderMessages_createServerFn_handler = createServerRpc({
	id: "f5346c71bb2c61d0c72254edb45f6539062ec4e0fa428b482f959b9b30e46078",
	name: "fetchOlderMessages",
	filename: "src/lib/chat.functions.ts"
}, (opts) => fetchOlderMessages.__executeServer(opts));
var fetchOlderMessages = createServerFn({ method: "GET" }).validator((data) => data).handler(fetchOlderMessages_createServerFn_handler, async ({ data: { conversationId, beforeIso, limit } }) => {
	await getAuthOrThrow();
	return (await prisma.message.findMany({
		where: {
			conversation_id: conversationId,
			created_at: { lt: new Date(beforeIso) }
		},
		orderBy: { created_at: "desc" },
		take: limit
	})).slice().reverse();
});
var fetchMessagesByIds_createServerFn_handler = createServerRpc({
	id: "9831eee71e4bd7266239931adb47f4ed7a041c7154b2491dbe833e5f0043d309",
	name: "fetchMessagesByIds",
	filename: "src/lib/chat.functions.ts"
}, (opts) => fetchMessagesByIds.__executeServer(opts));
var fetchMessagesByIds = createServerFn({ method: "GET" }).validator((ids) => ids).handler(fetchMessagesByIds_createServerFn_handler, async ({ data: ids }) => {
	await getAuthOrThrow();
	if (ids.length === 0) return [];
	return await prisma.message.findMany({ where: { id: { in: ids } } });
});
var sendMessage_createServerFn_handler = createServerRpc({
	id: "4f34919086f2a4130097c5da5423c36b625cea14ed1b142c70bfe1b53f9fd398",
	name: "sendMessage",
	filename: "src/lib/chat.functions.ts"
}, (opts) => sendMessage.__executeServer(opts));
var sendMessage = createServerFn({ method: "POST" }).validator((data) => data).handler(sendMessage_createServerFn_handler, async ({ data: { conversationId, content, attachments, replyTo, forwardedFrom, mentions } }) => {
	const authResult = await getAuthOrThrow();
	const newMsg = await prisma.message.create({ data: {
		conversation_id: conversationId,
		sender_id: authResult.userId,
		content,
		attachments: attachments ?? [],
		reply_to: replyTo ?? null,
		forwarded_from: forwardedFrom ?? null,
		mentions: mentions ?? []
	} });
	try {
		const appId = process.env.VITE_ONESIGNAL_APP_ID;
		const apiKey = process.env.VITE_ONESIGNAL_API_KEY;
		if (appId && apiKey) {
			const targetIds = (await prisma.conversationMember.findMany({
				where: {
					conversation_id: conversationId,
					user_id: { not: authResult.userId }
				},
				select: { user_id: true }
			})).map((m) => m.user_id);
			if (targetIds.length > 0) {
				const senderName = (await prisma.profile.findUnique({ where: { id: authResult.userId } }))?.full_name || "Someone";
				await fetch("https://onesignal.com/api/v1/notifications", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Basic ${apiKey}`
					},
					body: JSON.stringify({
						app_id: appId,
						include_aliases: { external_id: targetIds },
						target_channel: "push",
						headings: { en: senderName },
						contents: { en: content || "Sent an attachment" }
					})
				});
			}
		}
	} catch (err) {
		console.error("Failed to send push notification", err);
	}
	await broadcast("chat", `message-${conversationId}`, {
		type: "new_message",
		messageId: newMsg.id
	});
	return newMsg;
});
var uploadChatAttachment_createServerFn_handler = createServerRpc({
	id: "afc210cd2692178362cd716d9352105053e4912ac4e35632d258c44135e2a1ee",
	name: "uploadChatAttachment",
	filename: "src/lib/chat.functions.ts"
}, (opts) => uploadChatAttachment.__executeServer(opts));
var uploadChatAttachment = createServerFn({ method: "POST" }).validator((data) => data).handler(uploadChatAttachment_createServerFn_handler, async ({ data: { conversationId, fileBase64, fileName, mimeType } }) => {
	const authResult = await getAuthOrThrow();
	import_cloudinary.v2.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET
	});
	const base64Data = `data:${mimeType};base64,${fileBase64}`;
	const uploadResult = await import_cloudinary.v2.uploader.upload(base64Data, {
		folder: `workmonitor/chat/${conversationId}`,
		public_id: `${authResult.userId}-${Date.now()}-${fileName}`,
		resource_type: "auto"
	});
	const kind = mimeType.startsWith("image/") ? "image" : mimeType.startsWith("video/") ? "video" : mimeType.startsWith("audio/") ? "audio" : "file";
	return {
		path: uploadResult.public_id,
		url: uploadResult.secure_url,
		name: fileName,
		type: mimeType,
		size: uploadResult.bytes,
		kind
	};
});
var findOrCreateDM_createServerFn_handler = createServerRpc({
	id: "665e2994875a8bec8907da0e072f18b54d89a766c0017389e090f05bff3fb1e8",
	name: "findOrCreateDM",
	filename: "src/lib/chat.functions.ts"
}, (opts) => findOrCreateDM.__executeServer(opts));
var findOrCreateDM = createServerFn({ method: "POST" }).validator((otherUserId) => otherUserId).handler(findOrCreateDM_createServerFn_handler, async ({ data: otherUserId }) => {
	const currentUserId = (await getAuthOrThrow()).userId;
	const dmIds = (await prisma.conversationMember.findMany({
		where: { user_id: currentUserId },
		include: { conversation: true }
	})).filter((m) => m.conversation.is_group === false).map((m) => m.conversation_id);
	if (dmIds.length > 0) {
		const match = await prisma.conversationMember.findFirst({ where: {
			user_id: otherUserId,
			conversation_id: { in: dmIds }
		} });
		if (match) return match.conversation_id;
	}
	const conv = await prisma.conversation.create({ data: {
		is_group: false,
		name: null
	} });
	await prisma.conversationMember.createMany({ data: [{
		conversation_id: conv.id,
		user_id: currentUserId
	}, {
		conversation_id: conv.id,
		user_id: otherUserId
	}] });
	await broadcast("conversations", `user-${currentUserId}`, { type: "new_conversation" });
	await broadcast("conversations", `user-${otherUserId}`, { type: "new_conversation" });
	return conv.id;
});
var createGroup_createServerFn_handler = createServerRpc({
	id: "4e59093e745dfa52fba5969d3386fe4e685af376957e10c22199d4d350217865",
	name: "createGroup",
	filename: "src/lib/chat.functions.ts"
}, (opts) => createGroup.__executeServer(opts));
var createGroup = createServerFn({ method: "POST" }).validator((data) => data).handler(createGroup_createServerFn_handler, async ({ data: { name, memberIds } }) => {
	const authResult = await getAuthOrThrow();
	const conv = await prisma.conversation.create({ data: {
		is_group: true,
		name
	} });
	const ids = Array.from(/* @__PURE__ */ new Set([authResult.userId, ...memberIds]));
	await prisma.conversationMember.createMany({ data: ids.map((id) => ({
		conversation_id: conv.id,
		user_id: id
	})) });
	for (const id of ids) await broadcast("conversations", `user-${id}`, { type: "new_group" });
	return conv.id;
});
var editMessage_createServerFn_handler = createServerRpc({
	id: "0dec9725f3993c3ca25f807f7c8f466ce2642a7e6e36840cf6d2444b295a2f3e",
	name: "editMessage",
	filename: "src/lib/chat.functions.ts"
}, (opts) => editMessage.__executeServer(opts));
var editMessage = createServerFn({ method: "POST" }).validator((data) => data).handler(editMessage_createServerFn_handler, async ({ data: { messageId, content } }) => {
	await getAuthOrThrow();
	await broadcast("chat", `message-${(await prisma.message.update({
		where: { id: messageId },
		data: {
			content,
			edited_at: /* @__PURE__ */ new Date()
		}
	})).conversation_id}`, {
		type: "edit_message",
		messageId
	});
	return true;
});
var deleteMessage_createServerFn_handler = createServerRpc({
	id: "b35491c36e27f5115c29bf560f87e82f8525880d6c818a41176c654893ddb644",
	name: "deleteMessage",
	filename: "src/lib/chat.functions.ts"
}, (opts) => deleteMessage.__executeServer(opts));
var deleteMessage = createServerFn({ method: "POST" }).validator((messageId) => messageId).handler(deleteMessage_createServerFn_handler, async ({ data: messageId }) => {
	await getAuthOrThrow();
	await broadcast("chat", `message-${(await prisma.message.update({
		where: { id: messageId },
		data: {
			content: "",
			attachments: [],
			deleted_at: /* @__PURE__ */ new Date()
		}
	})).conversation_id}`, {
		type: "delete_message",
		messageId
	});
	return true;
});
var deleteMessageForMe_createServerFn_handler = createServerRpc({
	id: "4404aa467584079797cc817515962aa3efe68afc7c3d029926fbde36a548cf20",
	name: "deleteMessageForMe",
	filename: "src/lib/chat.functions.ts"
}, (opts) => deleteMessageForMe.__executeServer(opts));
var deleteMessageForMe = createServerFn({ method: "POST" }).validator((messageId) => messageId).handler(deleteMessageForMe_createServerFn_handler, async ({ data: messageId }) => {
	const authResult = await getAuthOrThrow();
	try {
		await prisma.hiddenMessage.create({ data: {
			message_id: messageId,
			user_id: authResult.userId
		} });
	} catch {}
	return true;
});
var leaveConversation_createServerFn_handler = createServerRpc({
	id: "f93df7092d41cd8f525b3c557bb31f58a529585b017bb0122d001feb5ac39b4e",
	name: "leaveConversation",
	filename: "src/lib/chat.functions.ts"
}, (opts) => leaveConversation.__executeServer(opts));
var leaveConversation = createServerFn({ method: "POST" }).validator((conversationId) => conversationId).handler(leaveConversation_createServerFn_handler, async ({ data: conversationId }) => {
	const authResult = await getAuthOrThrow();
	await prisma.conversationMember.deleteMany({ where: {
		conversation_id: conversationId,
		user_id: authResult.userId
	} });
	return true;
});
var toggleMuteConversation_createServerFn_handler = createServerRpc({
	id: "b27a5f2f27974f9b072d072ac49f47230ef66b297cedb321708137415ee8d046",
	name: "toggleMuteConversation",
	filename: "src/lib/chat.functions.ts"
}, (opts) => toggleMuteConversation.__executeServer(opts));
var toggleMuteConversation = createServerFn({ method: "POST" }).validator((data) => data).handler(toggleMuteConversation_createServerFn_handler, async ({ data: { conversationId, mute } }) => {
	const authResult = await getAuthOrThrow();
	if ((await prisma.conversationMember.findMany({ where: {
		conversation_id: conversationId,
		user_id: authResult.userId
	} })).length > 0) await prisma.conversationMember.updateMany({
		where: {
			conversation_id: conversationId,
			user_id: authResult.userId
		},
		data: { muted_at: mute ? /* @__PURE__ */ new Date() : null }
	});
	return true;
});
var fetchMuteMap_createServerFn_handler = createServerRpc({
	id: "055ee0854db1bf552f2fc2e32ac044fb700921aff7c556326dafd95dd9375d80",
	name: "fetchMuteMap",
	filename: "src/lib/chat.functions.ts"
}, (opts) => fetchMuteMap.__executeServer(opts));
var fetchMuteMap = createServerFn({ method: "GET" }).handler(fetchMuteMap_createServerFn_handler, async () => {
	const authResult = await getAuthOrThrow();
	const memberships = await prisma.conversationMember.findMany({
		where: { user_id: authResult.userId },
		select: {
			conversation_id: true,
			muted_at: true
		}
	});
	const map = {};
	for (const r of memberships) map[r.conversation_id] = Boolean(r.muted_at);
	return map;
});
var togglePinMessage_createServerFn_handler = createServerRpc({
	id: "c4630958e93cd0c489bd0117cbbf1ef9f302db0b86fd4c9c119c4952cd2da92e",
	name: "togglePinMessage",
	filename: "src/lib/chat.functions.ts"
}, (opts) => togglePinMessage.__executeServer(opts));
var togglePinMessage = createServerFn({ method: "POST" }).validator((data) => data).handler(togglePinMessage_createServerFn_handler, async ({ data: { messageId, pinned } }) => {
	const authResult = await getAuthOrThrow();
	await prisma.message.update({
		where: { id: messageId },
		data: {
			pinned_at: pinned ? /* @__PURE__ */ new Date() : null,
			pinned_by: pinned ? authResult.userId : null
		}
	});
	return true;
});
var fetchPinnedMessages_createServerFn_handler = createServerRpc({
	id: "ab148da7c1dc5b8321a795d823893f60fb470e77d415d57d8842908e91329f85",
	name: "fetchPinnedMessages",
	filename: "src/lib/chat.functions.ts"
}, (opts) => fetchPinnedMessages.__executeServer(opts));
var fetchPinnedMessages = createServerFn({ method: "GET" }).validator((conversationId) => conversationId).handler(fetchPinnedMessages_createServerFn_handler, async ({ data: conversationId }) => {
	await getAuthOrThrow();
	return await prisma.message.findMany({
		where: {
			conversation_id: conversationId,
			pinned_at: { not: null }
		},
		orderBy: { pinned_at: "desc" }
	});
});
var fetchReactions_createServerFn_handler = createServerRpc({
	id: "06e49e2bbc538390b9648a393768d445a79673cde1c8ace1517f6bf9363cdbcf",
	name: "fetchReactions",
	filename: "src/lib/chat.functions.ts"
}, (opts) => fetchReactions.__executeServer(opts));
var fetchReactions = createServerFn({ method: "GET" }).validator((conversationId) => conversationId).handler(fetchReactions_createServerFn_handler, async ({ data: conversationId }) => {
	await getAuthOrThrow();
	const ids = (await prisma.message.findMany({
		where: { conversation_id: conversationId },
		select: { id: true }
	})).map((m) => m.id);
	if (ids.length === 0) return [];
	return await prisma.messageReaction.findMany({ where: { message_id: { in: ids } } });
});
var toggleReaction_createServerFn_handler = createServerRpc({
	id: "11569421a3def8d3eb1658e144c410b3213884a2c8371c10570d344ccf2f46e4",
	name: "toggleReaction",
	filename: "src/lib/chat.functions.ts"
}, (opts) => toggleReaction.__executeServer(opts));
var toggleReaction = createServerFn({ method: "POST" }).validator((data) => data).handler(toggleReaction_createServerFn_handler, async ({ data: { messageId, emoji, has } }) => {
	const authResult = await getAuthOrThrow();
	if (has) await prisma.messageReaction.deleteMany({ where: {
		message_id: messageId,
		user_id: authResult.userId,
		emoji
	} });
	else await prisma.messageReaction.create({ data: {
		message_id: messageId,
		user_id: authResult.userId,
		emoji
	} });
	return true;
});
var fetchStarredIds_createServerFn_handler = createServerRpc({
	id: "d71fa43e762f342f7314ecfabc68adb31f121a58300480e3364af3cc860ee763",
	name: "fetchStarredIds",
	filename: "src/lib/chat.functions.ts"
}, (opts) => fetchStarredIds.__executeServer(opts));
var fetchStarredIds = createServerFn({ method: "GET" }).handler(fetchStarredIds_createServerFn_handler, async () => {
	const authResult = await getAuthOrThrow();
	return (await prisma.starredMessage.findMany({
		where: { user_id: authResult.userId },
		select: { message_id: true }
	})).map((s) => s.message_id);
});
var toggleStar_createServerFn_handler = createServerRpc({
	id: "f5fe0eee41d94970afc09bb8f6e3574b5c0e687ad085c66b7e61f3b4b57d0f9b",
	name: "toggleStar",
	filename: "src/lib/chat.functions.ts"
}, (opts) => toggleStar.__executeServer(opts));
var toggleStar = createServerFn({ method: "POST" }).validator((data) => data).handler(toggleStar_createServerFn_handler, async ({ data: { messageId, starred } }) => {
	const authResult = await getAuthOrThrow();
	if (starred) await prisma.starredMessage.deleteMany({ where: {
		message_id: messageId,
		user_id: authResult.userId
	} });
	else await prisma.starredMessage.create({ data: {
		message_id: messageId,
		user_id: authResult.userId
	} });
	return true;
});
var markConversationRead_createServerFn_handler = createServerRpc({
	id: "2216d629e02d38a41f65adec08148687e7cc80295a49818869b39ba5b4e64e87",
	name: "markConversationRead",
	filename: "src/lib/chat.functions.ts"
}, (opts) => markConversationRead.__executeServer(opts));
var markConversationRead = createServerFn({ method: "POST" }).validator((conversationId) => conversationId).handler(markConversationRead_createServerFn_handler, async ({ data: conversationId }) => {
	const authResult = await getAuthOrThrow();
	await prisma.conversationMember.updateMany({
		where: {
			conversation_id: conversationId,
			user_id: authResult.userId
		},
		data: { last_read_at: /* @__PURE__ */ new Date() }
	});
	return true;
});
var fetchLastReadMap_createServerFn_handler = createServerRpc({
	id: "603ad61057ccaf6347f6e7fef6c6e9712f1d7b66e040d6d351d63317e877abe8",
	name: "fetchLastReadMap",
	filename: "src/lib/chat.functions.ts"
}, (opts) => fetchLastReadMap.__executeServer(opts));
var fetchLastReadMap = createServerFn({ method: "GET" }).handler(fetchLastReadMap_createServerFn_handler, async () => {
	const authResult = await getAuthOrThrow();
	const memberships = await prisma.conversationMember.findMany({
		where: { user_id: authResult.userId },
		select: {
			conversation_id: true,
			last_read_at: true
		}
	});
	const map = {};
	for (const r of memberships) if (r.last_read_at) map[r.conversation_id] = r.last_read_at.toISOString();
	return map;
});
var fetchLastReadByMembers_createServerFn_handler = createServerRpc({
	id: "7d2457fef53bf38a4484bba18aea35f2b161e9318e7cc63aad2809e526f98d04",
	name: "fetchLastReadByMembers",
	filename: "src/lib/chat.functions.ts"
}, (opts) => fetchLastReadByMembers.__executeServer(opts));
var fetchLastReadByMembers = createServerFn({ method: "GET" }).validator((conversationId) => conversationId).handler(fetchLastReadByMembers_createServerFn_handler, async ({ data: conversationId }) => {
	await getAuthOrThrow();
	const memberships = await prisma.conversationMember.findMany({
		where: { conversation_id: conversationId },
		select: {
			user_id: true,
			last_read_at: true
		}
	});
	const map = {};
	for (const r of memberships) if (r.last_read_at) map[r.user_id] = r.last_read_at.toISOString();
	return map;
});
var fetchUnreadCounts_createServerFn_handler = createServerRpc({
	id: "01844b81128f5389c43819e3a3d81fd3f51ad8c7bc3a1a7cf0d84750f48c7fef",
	name: "fetchUnreadCounts",
	filename: "src/lib/chat.functions.ts"
}, (opts) => fetchUnreadCounts.__executeServer(opts));
var fetchUnreadCounts = createServerFn({ method: "POST" }).validator((data) => data).handler(fetchUnreadCounts_createServerFn_handler, async ({ data: { conversationIds, lastRead } }) => {
	const authResult = await getAuthOrThrow();
	const result = {};
	await Promise.all(conversationIds.map(async (cid) => {
		const since = lastRead[cid] ? new Date(lastRead[cid]) : /* @__PURE__ */ new Date(0);
		const count = await prisma.message.count({ where: {
			conversation_id: cid,
			sender_id: { not: authResult.userId },
			created_at: { gt: since }
		} });
		result[cid] = count;
	}));
	return result;
});
var renameGroup_createServerFn_handler = createServerRpc({
	id: "22b220d59868c5fa673e1436d34612582470d448416ddfebec58203d71a015d8",
	name: "renameGroup",
	filename: "src/lib/chat.functions.ts"
}, (opts) => renameGroup.__executeServer(opts));
var renameGroup = createServerFn({ method: "POST" }).validator((data) => data).handler(renameGroup_createServerFn_handler, async ({ data: { conversationId, name } }) => {
	await getAuthOrThrow();
	await prisma.conversation.update({
		where: { id: conversationId },
		data: { name }
	});
	return true;
});
var addGroupMembers_createServerFn_handler = createServerRpc({
	id: "3c4988fc48ad1a28797b2bcdd7b56a965f52130d7f916a002a878d538a8290fc",
	name: "addGroupMembers",
	filename: "src/lib/chat.functions.ts"
}, (opts) => addGroupMembers.__executeServer(opts));
var addGroupMembers = createServerFn({ method: "POST" }).validator((data) => data).handler(addGroupMembers_createServerFn_handler, async ({ data: { conversationId, userIds } }) => {
	await getAuthOrThrow();
	if (userIds.length === 0) return true;
	await prisma.conversationMember.createMany({
		data: userIds.map((id) => ({
			conversation_id: conversationId,
			user_id: id
		})),
		skipDuplicates: true
	});
	return true;
});
var removeGroupMember_createServerFn_handler = createServerRpc({
	id: "f433ab522f619d6b4238d76dacd596132391f48d6e78a265ffaad8e255cde451",
	name: "removeGroupMember",
	filename: "src/lib/chat.functions.ts"
}, (opts) => removeGroupMember.__executeServer(opts));
var removeGroupMember = createServerFn({ method: "POST" }).validator((data) => data).handler(removeGroupMember_createServerFn_handler, async ({ data: { conversationId, userId } }) => {
	await getAuthOrThrow();
	await prisma.conversationMember.deleteMany({ where: {
		conversation_id: conversationId,
		user_id: userId
	} });
	return true;
});
//#endregion
export { addGroupMembers_createServerFn_handler, createGroup_createServerFn_handler, deleteMessageForMe_createServerFn_handler, deleteMessage_createServerFn_handler, editMessage_createServerFn_handler, fetchConversationMembers_createServerFn_handler, fetchLastReadByMembers_createServerFn_handler, fetchLastReadMap_createServerFn_handler, fetchMessagesByIds_createServerFn_handler, fetchMessages_createServerFn_handler, fetchMuteMap_createServerFn_handler, fetchMyConversations_createServerFn_handler, fetchOlderMessages_createServerFn_handler, fetchPinnedMessages_createServerFn_handler, fetchReactions_createServerFn_handler, fetchStarredIds_createServerFn_handler, fetchUnreadCounts_createServerFn_handler, findOrCreateDM_createServerFn_handler, leaveConversation_createServerFn_handler, markConversationRead_createServerFn_handler, removeGroupMember_createServerFn_handler, renameGroup_createServerFn_handler, sendMessage_createServerFn_handler, toggleMuteConversation_createServerFn_handler, togglePinMessage_createServerFn_handler, toggleReaction_createServerFn_handler, toggleStar_createServerFn_handler, uploadChatAttachment_createServerFn_handler };
