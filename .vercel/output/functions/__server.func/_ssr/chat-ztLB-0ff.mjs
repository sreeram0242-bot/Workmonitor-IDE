import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-BDx8PeYO.mjs";
import { n as useAuth } from "./use-auth-BHcLpo1A.mjs";
import { _ as fetchTeam, y as getCachedTeam } from "./tasks-CQ010v_B.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { A as Paperclip, D as PinOff, E as Pin, G as Forward, H as Image, K as Film, M as MessageSquare, O as Pencil, P as LogOut, R as Link, S as Reply, T as Plus, Y as EllipsisVertical, b as Search, f as Star, ft as Bell, h as Smile, ht as ArrowLeft, i as Users, j as Mic, m as Sparkles, n as X, ot as Check, p as Square, pt as BellOff, q as FileText, r as WandSparkles, s as UserPlus, st as CheckCheck, u as Trash2, v as Settings2, y as Send } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-BFvnb9Z1.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { n as sendNotifications } from "./notify-B0135TIm.mjs";
import { t as useRealtimeSubscription } from "./use-realtime-DP3QdmcJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { n as PersonIcon, t as BadgePill } from "./BadgePill-CkoIACtc.mjs";
import { a as DropdownMenuTrigger, i as DropdownMenuSeparator, n as DropdownMenuContent, o as ScrollArea, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-Druen1KK.mjs";
import { i as PopoverTrigger$1, n as PopoverContent$1, r as PopoverPortal, t as Popover$1 } from "../_libs/radix-ui__react-popover.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-ztLB-0ff.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var Popover = Popover$1;
var PopoverTrigger = PopoverTrigger$1;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent$1, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = PopoverContent$1.displayName;
var fetchMyConversations$1 = createServerFn({ method: "GET" }).handler(createSsrRpc("55ece5e0c70b33f4832368023066a0bd0402e31a8c455732eaf820e5f4937bf4"));
var fetchConversationMembers$1 = createServerFn({ method: "GET" }).validator((conversationId) => conversationId).handler(createSsrRpc("02461e5d7c054a54852b86bce37fb5b00a83db5050c0aeb902d971166830154b"));
var fetchMessages$1 = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("9976442668355f38cb1edff0bc78908426a4aa972d4fbcbd4ba4579414b97c63"));
var fetchOlderMessages$1 = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("f5346c71bb2c61d0c72254edb45f6539062ec4e0fa428b482f959b9b30e46078"));
var fetchMessagesByIds$1 = createServerFn({ method: "GET" }).validator((ids) => ids).handler(createSsrRpc("9831eee71e4bd7266239931adb47f4ed7a041c7154b2491dbe833e5f0043d309"));
var sendMessage$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("4f34919086f2a4130097c5da5423c36b625cea14ed1b142c70bfe1b53f9fd398"));
var uploadChatAttachment$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("afc210cd2692178362cd716d9352105053e4912ac4e35632d258c44135e2a1ee"));
var findOrCreateDM$1 = createServerFn({ method: "POST" }).validator((otherUserId) => otherUserId).handler(createSsrRpc("665e2994875a8bec8907da0e072f18b54d89a766c0017389e090f05bff3fb1e8"));
var createGroup$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("4e59093e745dfa52fba5969d3386fe4e685af376957e10c22199d4d350217865"));
var editMessage$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("0dec9725f3993c3ca25f807f7c8f466ce2642a7e6e36840cf6d2444b295a2f3e"));
var deleteMessage$1 = createServerFn({ method: "POST" }).validator((messageId) => messageId).handler(createSsrRpc("b35491c36e27f5115c29bf560f87e82f8525880d6c818a41176c654893ddb644"));
var deleteMessageForMe$1 = createServerFn({ method: "POST" }).validator((messageId) => messageId).handler(createSsrRpc("4404aa467584079797cc817515962aa3efe68afc7c3d029926fbde36a548cf20"));
var leaveConversation$1 = createServerFn({ method: "POST" }).validator((conversationId) => conversationId).handler(createSsrRpc("f93df7092d41cd8f525b3c557bb31f58a529585b017bb0122d001feb5ac39b4e"));
var toggleMuteConversation$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("b27a5f2f27974f9b072d072ac49f47230ef66b297cedb321708137415ee8d046"));
var fetchMuteMap$1 = createServerFn({ method: "GET" }).handler(createSsrRpc("055ee0854db1bf552f2fc2e32ac044fb700921aff7c556326dafd95dd9375d80"));
var togglePinMessage$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("c4630958e93cd0c489bd0117cbbf1ef9f302db0b86fd4c9c119c4952cd2da92e"));
var fetchPinnedMessages$1 = createServerFn({ method: "GET" }).validator((conversationId) => conversationId).handler(createSsrRpc("ab148da7c1dc5b8321a795d823893f60fb470e77d415d57d8842908e91329f85"));
var fetchReactions$1 = createServerFn({ method: "GET" }).validator((conversationId) => conversationId).handler(createSsrRpc("06e49e2bbc538390b9648a393768d445a79673cde1c8ace1517f6bf9363cdbcf"));
var toggleReaction$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("11569421a3def8d3eb1658e144c410b3213884a2c8371c10570d344ccf2f46e4"));
var fetchStarredIds$1 = createServerFn({ method: "GET" }).handler(createSsrRpc("d71fa43e762f342f7314ecfabc68adb31f121a58300480e3364af3cc860ee763"));
var toggleStar$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("f5fe0eee41d94970afc09bb8f6e3574b5c0e687ad085c66b7e61f3b4b57d0f9b"));
var markConversationRead$1 = createServerFn({ method: "POST" }).validator((conversationId) => conversationId).handler(createSsrRpc("2216d629e02d38a41f65adec08148687e7cc80295a49818869b39ba5b4e64e87"));
var fetchLastReadMap$1 = createServerFn({ method: "GET" }).handler(createSsrRpc("603ad61057ccaf6347f6e7fef6c6e9712f1d7b66e040d6d351d63317e877abe8"));
var fetchLastReadByMembers$1 = createServerFn({ method: "GET" }).validator((conversationId) => conversationId).handler(createSsrRpc("7d2457fef53bf38a4484bba18aea35f2b161e9318e7cc63aad2809e526f98d04"));
var fetchUnreadCounts$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("01844b81128f5389c43819e3a3d81fd3f51ad8c7bc3a1a7cf0d84750f48c7fef"));
var renameGroup$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("22b220d59868c5fa673e1436d34612582470d448416ddfebec58203d71a015d8"));
var addGroupMembers$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("3c4988fc48ad1a28797b2bcdd7b56a965f52130d7f916a002a878d538a8290fc"));
var removeGroupMember$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("f433ab522f619d6b4238d76dacd596132391f48d6e78a265ffaad8e255cde451"));
async function fetchMyConversations(userId) {
	return await fetchMyConversations$1();
}
async function fetchConversationMembers(conversationId) {
	return await fetchConversationMembers$1({ data: conversationId });
}
async function fetchMessages(conversationId, limit = 50) {
	return await fetchMessages$1({ data: {
		conversationId,
		limit
	} });
}
async function fetchOlderMessages(conversationId, beforeIso, limit = 50) {
	return await fetchOlderMessages$1({ data: {
		conversationId,
		beforeIso,
		limit
	} });
}
async function fetchMessagesByIds(ids) {
	return await fetchMessagesByIds$1({ data: ids });
}
async function sendMessage(conversationId, senderId, content, attachments = [], extras = {}) {
	await sendMessage$1({ data: {
		conversationId,
		content,
		attachments,
		replyTo: extras.reply_to,
		forwardedFrom: extras.forwarded_from,
		mentions: extras.mentions
	} });
}
async function uploadChatAttachment(conversationId, userId, file) {
	const buffer = await file.arrayBuffer();
	return await uploadChatAttachment$1({ data: {
		conversationId,
		fileBase64: Buffer.from(buffer).toString("base64"),
		fileName: file.name,
		mimeType: file.type || "application/octet-stream"
	} });
}
async function findOrCreateDM(currentUserId, otherUserId) {
	return await findOrCreateDM$1({ data: otherUserId });
}
async function createGroup(currentUserId, name, memberIds) {
	return await createGroup$1({ data: {
		name,
		memberIds
	} });
}
async function editMessage(messageId, content) {
	await editMessage$1({ data: {
		messageId,
		content
	} });
}
async function deleteMessage(messageId) {
	await deleteMessage$1({ data: messageId });
}
async function deleteMessageForMe(messageId) {
	await deleteMessageForMe$1({ data: messageId });
}
async function leaveConversation(conversationId) {
	await leaveConversation$1({ data: conversationId });
}
async function toggleMuteConversation(conversationId, mute) {
	await toggleMuteConversation$1({ data: {
		conversationId,
		mute
	} });
}
async function fetchMuteMap(userId) {
	return await fetchMuteMap$1();
}
async function togglePinMessage(messageId, userId, pinned) {
	await togglePinMessage$1({ data: {
		messageId,
		pinned
	} });
}
async function fetchPinnedMessages(conversationId) {
	return await fetchPinnedMessages$1({ data: conversationId });
}
async function fetchReactions(conversationId) {
	return await fetchReactions$1({ data: conversationId });
}
async function toggleReaction(messageId, userId, emoji, has) {
	await toggleReaction$1({ data: {
		messageId,
		emoji,
		has
	} });
}
async function fetchStarredIds(userId) {
	return await fetchStarredIds$1();
}
async function toggleStar(messageId, userId, starred) {
	await toggleStar$1({ data: {
		messageId,
		starred
	} });
}
async function markConversationRead(conversationId, userId) {
	await markConversationRead$1({ data: conversationId });
}
async function fetchLastReadMap(userId) {
	return await fetchLastReadMap$1();
}
async function fetchLastReadByMembers(conversationId) {
	return await fetchLastReadByMembers$1({ data: conversationId });
}
async function fetchUnreadCounts(userId, conversationIds, lastRead) {
	return await fetchUnreadCounts$1({ data: {
		conversationIds,
		lastRead
	} });
}
async function renameGroup(conversationId, name) {
	await renameGroup$1({ data: {
		conversationId,
		name
	} });
}
async function addGroupMembers(conversationId, userIds) {
	await addGroupMembers$1({ data: {
		conversationId,
		userIds
	} });
}
async function removeGroupMember(conversationId, userId) {
	await removeGroupMember$1({ data: {
		conversationId,
		userId
	} });
}
function extractMentions(text, team) {
	const found = /* @__PURE__ */ new Set();
	const re = /@([\p{L}][\p{L}0-9._-]{1,40})/gu;
	let m;
	while (m = re.exec(text)) {
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
function extractFirstUrl(text) {
	const m = text.match(/https?:\/\/[^\s<>"']+/i);
	return m ? m[0] : null;
}
var MESSAGE_EFFECTS = [
	{
		id: "fire",
		label: "Fire",
		icon: "🔥"
	},
	{
		id: "hearts",
		label: "Hearts",
		icon: "❤️"
	},
	{
		id: "confetti",
		label: "Confetti",
		icon: "🎉"
	},
	{
		id: "sparkles",
		label: "Sparkle",
		icon: "✨"
	},
	{
		id: "neon",
		label: "Neon",
		icon: "💡"
	},
	{
		id: "shake",
		label: "Shake",
		icon: "💥"
	},
	{
		id: "rainbow",
		label: "Rainbow",
		icon: "🌈"
	},
	{
		id: "snow",
		label: "Snow",
		icon: "❄️"
	}
];
var FX_RE = /^\[\[fx:([a-z]+)\]\]\s*/;
function parseEffect(content) {
	if (!content) return {
		effect: null,
		text: content ?? ""
	};
	const m = content.match(FX_RE);
	if (!m) return {
		effect: null,
		text: content
	};
	const id = m[1];
	return {
		effect: MESSAGE_EFFECTS.some((e) => e.id === id) ? id : null,
		text: content.replace(FX_RE, "")
	};
}
function encodeEffect(effect, text) {
	return effect ? `[[fx:${effect}]] ${text}` : text;
}
function formatRelative(iso) {
	const then = new Date(iso).getTime();
	const diff = Math.max(0, Date.now() - then);
	const s = Math.floor(diff / 1e3);
	if (s < 45) return "just now";
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.floor(h / 24);
	if (d < 7) return `${d}d ago`;
	return new Date(iso).toLocaleDateString([], {
		month: "short",
		day: "numeric"
	});
}
function useTick(intervalMs = 6e4) {
	const [, setT] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setT((x) => x + 1), intervalMs);
		return () => clearInterval(id);
	}, [intervalMs]);
}
function avatarColor(seed) {
	const palette = [
		"from-blue-500 to-indigo-600",
		"from-sky-500 to-blue-600",
		"from-violet-500 to-purple-600",
		"from-emerald-500 to-teal-600",
		"from-amber-500 to-orange-600",
		"from-rose-500 to-pink-600",
		"from-cyan-500 to-blue-600"
	];
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = h * 31 + seed.charCodeAt(i) >>> 0;
	return palette[h % palette.length];
}
function Avatar({ name, group, admin, size = 40, online, url }) {
	const hasImage = !!url && !group;
	const gradient = avatarColor(name || "x");
	const bgClass = hasImage ? `bg-gradient-to-br ${gradient} text-white` : group ? `bg-gradient-to-br ${gradient} text-white` : admin ? "bg-brand-accent/10 text-brand-accent" : "bg-muted text-muted-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative shrink-0",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `flex h-full w-full items-center justify-center overflow-hidden rounded-full ${bgClass} shadow-sm ring-2 ring-background`,
			children: hasImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: url,
				alt: name,
				className: "h-full w-full object-cover"
			}) : group ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-1/2 w-1/2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonIcon, {
				admin,
				className: "h-[62%] w-[62%]"
			})
		}), online && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" })]
	});
}
function ChatPage() {
	const { user, profile } = useAuth();
	useTick(6e4);
	const [team, setTeam] = (0, import_react.useState)(() => getCachedTeam() ?? []);
	const [conversations, setConversations] = (0, import_react.useState)([]);
	const [convMembers, setConvMembers] = (0, import_react.useState)({});
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [pendingFiles, setPendingFiles] = (0, import_react.useState)([]);
	const [pendingEffect, setPendingEffect] = (0, import_react.useState)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [newGroupOpen, setNewGroupOpen] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [lastRead, setLastRead] = (0, import_react.useState)({});
	const [unread, setUnread] = (0, import_react.useState)({});
	const [onlineUsers, setOnlineUsers] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [typingUsers, setTypingUsers] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editingText, setEditingText] = (0, import_react.useState)("");
	const [manageOpen, setManageOpen] = (0, import_react.useState)(false);
	const [hasMoreOlder, setHasMoreOlder] = (0, import_react.useState)(false);
	const [loadingOlder, setLoadingOlder] = (0, import_react.useState)(false);
	const [reactions, setReactions] = (0, import_react.useState)([]);
	const [starredIds, setStarredIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [pinned, setPinned] = (0, import_react.useState)([]);
	const [replyTo, setReplyTo] = (0, import_react.useState)(null);
	const [inChatSearch, setInChatSearch] = (0, import_react.useState)(false);
	const [mutes, setMutes] = (0, import_react.useState)({});
	const [lightboxUrl, setLightboxUrl] = (0, import_react.useState)(null);
	const [inChatQuery, setInChatQuery] = (0, import_react.useState)("");
	const [showStarredPanel, setShowStarredPanel] = (0, import_react.useState)(false);
	const [starredMessages, setStarredMessages] = (0, import_react.useState)([]);
	const [forwardMessage, setForwardMessage] = (0, import_react.useState)(null);
	const [readByMap, setReadByMap] = (0, import_react.useState)({});
	const [recording, setRecording] = (0, import_react.useState)(false);
	const [recordSeconds, setRecordSeconds] = (0, import_react.useState)(0);
	const mediaRecorderRef = (0, import_react.useRef)(null);
	const recordChunksRef = (0, import_react.useRef)([]);
	const recordTimerRef = (0, import_react.useRef)(null);
	const scrollRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const activeIdRef = (0, import_react.useRef)(null);
	(0, import_react.useRef)(0);
	const teamById = (0, import_react.useMemo)(() => new Map(team.map((m) => [m.id, m])), [team]);
	(0, import_react.useEffect)(() => {
		activeIdRef.current = activeId;
	}, [activeId]);
	async function reloadConversations() {
		if (!user) return;
		const [convs, t] = await Promise.all([fetchMyConversations(user.id), fetchTeam()]);
		setConversations(convs);
		setTeam(t);
		const memberMap = {};
		await Promise.all(convs.map(async (c) => {
			memberMap[c.id] = await fetchConversationMembers(c.id);
		}));
		setConvMembers(memberMap);
		const lr = await fetchLastReadMap(user.id);
		setLastRead(lr);
		const uc = await fetchUnreadCounts(user.id, convs.map((c) => c.id), lr);
		setUnread(uc);
		setMutes(await fetchMuteMap(user.id));
	}
	(0, import_react.useEffect)(() => {
		reloadConversations();
	}, [user?.id]);
	useRealtimeSubscription("conversations", `user-${user?.id}`, () => {
		reloadConversations();
	});
	(0, import_react.useEffect)(() => {
		if (!user) return;
		fetchStarredIds(user.id).then((ids) => setStarredIds(new Set(ids)));
	}, [user?.id]);
	(0, import_react.useEffect)(() => {
		if (!activeId || !user) {
			setMessages([]);
			setOnlineUsers(/* @__PURE__ */ new Set());
			setTypingUsers(/* @__PURE__ */ new Set());
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
				setHasMoreOlder(msgs.length >= 50);
			});
			fetchPinnedMessages(activeId).then(setPinned);
			fetchReactions(activeId).then(setReactions);
			fetchLastReadByMembers(activeId).then(setReadByMap);
			markConversationRead(activeId, user.id).then(() => {
				setLastRead((prev) => ({
					...prev,
					[activeId]: (/* @__PURE__ */ new Date()).toISOString()
				}));
				setUnread((prev) => ({
					...prev,
					[activeId]: 0
				}));
			});
		}
		loadChat();
	}, [activeId, user?.id]);
	useRealtimeSubscription("chat", `message-${activeId}`, () => {
		if (!activeId || !user) return;
		fetchMessages(activeId).then((msgs) => {
			setMessages(msgs);
			setHasMoreOlder(msgs.length >= 50);
		});
	});
	(0, import_react.useEffect)(() => {
		if (loadingOlder) return;
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [
		messages,
		activeId,
		typingUsers,
		loadingOlder
	]);
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
			const attachments = [];
			for (const f of files) attachments.push(await uploadChatAttachment(activeId, user.id, f));
			const encoded = encodeEffect(effect, content);
			await sendMessage(activeId, user.id, encoded, attachments, {
				reply_to: reply?.id ?? null,
				mentions: mentionIds
			});
			await markConversationRead(activeId, user.id);
			const others = (convMembers[activeId] ?? []).filter((m) => m !== user.id);
			const senderName = teamById.get(user.id)?.full_name ?? "teammate";
			const notifications = [];
			if (others.length > 0) for (const uid of others) if (mentionIds.includes(uid)) notifications.push({
				user_id: uid,
				type: "mention",
				message: `${senderName} mentioned you`,
				link: "/chat"
			});
			else notifications.push({
				user_id: uid,
				type: "message",
				message: `New message from ${senderName}`,
				link: "/chat"
			});
			if (notifications.length > 0) await sendNotifications(notifications);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Failed to send";
			toast.error(msg);
			setInput(content);
			setPendingFiles(files);
			setReplyTo(reply);
		} finally {
			setUploading(false);
		}
	}
	async function handleReactionToggle(messageId, emoji) {
		if (!user) return;
		const has = reactions.some((r) => r.message_id === messageId && r.user_id === user.id && r.emoji === emoji);
		if (has) setReactions((prev) => prev.filter((r) => !(r.message_id === messageId && r.user_id === user.id && r.emoji === emoji)));
		else setReactions((prev) => [...prev, {
			id: `tmp-${Math.random()}`,
			message_id: messageId,
			user_id: user.id,
			emoji
		}]);
		try {
			await toggleReaction(messageId, user.id, emoji, has);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Reaction failed");
		}
	}
	async function handleTogglePin(m) {
		if (!user) return;
		try {
			await togglePinMessage(m.id, user.id, !m.pinned_at);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Pin failed");
		}
	}
	async function handleToggleStar(id) {
		if (!user) return;
		const has = starredIds.has(id);
		const next = new Set(starredIds);
		if (has) next.delete(id);
		else next.add(id);
		setStarredIds(next);
		try {
			await toggleStar(id, user.id, has);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Star failed");
			setStarredIds(starredIds);
		}
	}
	async function handleForwardTo(targetConvId) {
		if (!user || !forwardMessage) return;
		try {
			await sendMessage(targetConvId, user.id, forwardMessage.content, forwardMessage.attachments ?? [], { forwarded_from: forwardMessage.id });
			toast.success("Message forwarded");
			setForwardMessage(null);
			if (targetConvId !== activeId) setActiveId(targetConvId);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Forward failed");
		}
	}
	async function openStarredPanel() {
		if (!user) return;
		setShowStarredPanel(true);
		const msgs = await fetchMessagesByIds(Array.from(starredIds));
		setStarredMessages(msgs.slice().sort((a, b) => a.created_at > b.created_at ? -1 : 1));
	}
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
			recordTimerRef.current = window.setInterval(() => setRecordSeconds((s) => s + 1), 1e3);
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
	function onPickFiles(e) {
		const files = Array.from(e.target.files ?? []);
		if (files.length === 0) return;
		const oversized = files.find((f) => f.size > 25 * 1024 * 1024);
		if (oversized) toast.error(`${oversized.name} is over 25MB`);
		setPendingFiles((prev) => [...prev, ...files.filter((f) => f.size <= 25 * 1024 * 1024)]);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}
	async function openDM(otherId) {
		if (!user) return;
		try {
			const id = await findOrCreateDM(user.id, otherId);
			await reloadConversations();
			setActiveId(id);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to open DM");
		}
	}
	function conversationLabel(c) {
		if (c.is_group) return c.name ?? "Group";
		const other = (convMembers[c.id] ?? []).find((m) => m !== user?.id);
		return other ? teamById.get(other)?.full_name ?? "Direct message" : "Direct message";
	}
	function conversationAdmin(c) {
		if (c.is_group) return false;
		const other = (convMembers[c.id] ?? []).find((m) => m !== user?.id);
		return other ? teamById.get(other)?.role === "admin" : false;
	}
	function conversationBadge(c) {
		if (c.is_group) return null;
		const other = (convMembers[c.id] ?? []).find((m) => m !== user?.id);
		return other ? teamById.get(other)?.badge ?? null : null;
	}
	function otherUserId(c) {
		if (c.is_group) return null;
		return (convMembers[c.id] ?? []).find((m) => m !== user?.id) ?? null;
	}
	async function handleEditSave(id) {
		const text = editingText.trim();
		if (!text) {
			setEditingId(null);
			return;
		}
		try {
			await editMessage(id, text);
			setEditingId(null);
			setEditingText("");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to edit");
		}
	}
	async function handleDelete(id) {
		if (!confirm("Delete this message?")) return;
		try {
			await deleteMessage(id);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to delete");
		}
	}
	async function handleDeleteForMe(id) {
		try {
			await deleteMessageForMe(id);
		} catch (e) {
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
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to leave");
		}
	}
	const activeConv = conversations.find((c) => c.id === activeId);
	const otherTeam = team.filter((m) => m.id !== user?.id);
	const q = search.trim().toLowerCase();
	const filteredConvs = conversations.filter((c) => !q || conversationLabel(c).toLowerCase().includes(q));
	const filteredTeam = otherTeam.filter((m) => !q || m.full_name.toLowerCase().includes(q) || (m.position ?? "").toLowerCase().includes(q));
	const typingNames = Array.from(typingUsers).map((id) => teamById.get(id)?.full_name?.split(" ")[0]).filter(Boolean);
	const dmOtherId = activeConv ? otherUserId(activeConv) : null;
	const dmIsOnline = dmOtherId ? onlineUsers.has(dmOtherId) : false;
	const inQ = inChatQuery.trim().toLowerCase();
	const visibleMessages = (inQ ? messages.filter((m) => m.content?.toLowerCase().includes(inQ)) : messages).filter((m) => !user || !m.deleted_for || !(m.deleted_for ?? []).includes(user.id));
	const reactionsByMsg = (0, import_react.useMemo)(() => {
		const map = {};
		for (const r of reactions) {
			const byMsg = map[r.message_id] ??= {};
			(byMsg[r.emoji] ??= []).push(r.user_id);
		}
		return map;
	}, [reactions]);
	const messageById = (0, import_react.useMemo)(() => new Map(messages.map((m) => [m.id, m])), [messages]);
	const otherMembers = activeConv ? (convMembers[activeConv.id] ?? []).filter((id) => id !== user?.id) : [];
	const allReadByOthers = (m) => {
		if (otherMembers.length === 0) return false;
		return otherMembers.every((uid) => {
			const t = readByMap[uid];
			return t && t >= m.created_at;
		});
	};
	const fmtSec = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid h-[100dvh] grid-cols-1 gap-0 overflow-hidden bg-card/60 md:grid-cols-[300px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex flex-col overflow-hidden border-r border-border/60 bg-background/70 ${activeId ? "hidden md:flex" : "flex"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 border-b border-border/60 bg-white/70 p-4 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-brand-accent" }), "Conversations"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewGroupDialog, {
							open: newGroupOpen,
							onOpenChange: setNewGroupOpen,
							team: otherTeam,
							onCreate: async (name, ids) => {
								if (!user) return;
								const id = await createGroup(user.id, name, ids);
								await reloadConversations();
								setActiveId(id);
								setNewGroupOpen(false);
								toast.success("Group created");
							}
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search people or groups",
							className: "h-9 border-border/60 bg-background/80 pl-8 text-sm"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Groups & DMs"
							}),
							filteredConvs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2 py-2 text-xs text-muted-foreground",
								children: "No conversations yet."
							}),
							filteredConvs.map((c) => {
								const label = conversationLabel(c);
								const isActive = activeId === c.id;
								const unreadCount = unread[c.id] ?? 0;
								const otherId = otherUserId(c);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setActiveId(c.id),
									className: `group mb-0.5 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-all hover:bg-accent/70 ${isActive ? "bg-gradient-to-r from-brand/10 to-brand-accent/10 ring-1 ring-brand/20" : ""}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
											name: label,
											group: c.is_group,
											admin: conversationAdmin(c),
											size: 36,
											online: !!(otherId && onlineUsers.has(otherId)),
											url: otherId ? teamById.get(otherId)?.avatar_url : null
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `truncate ${unreadCount > 0 ? "font-semibold" : "font-medium"}`,
														children: label
													}),
													mutes[c.id] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "h-3 w-3 shrink-0 text-muted-foreground" }),
													c.is_group && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "ml-auto text-[9px]",
														children: "group"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-xs text-muted-foreground",
												children: c.is_group ? `${(convMembers[c.id] ?? []).length} members` : "Direct message"
											})]
										}),
										unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-1 inline-flex min-w-[20px] items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white",
											children: unreadCount > 99 ? "99+" : unreadCount
										})
									]
								}, c.id);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Start a DM"
							}),
							filteredTeam.map((m) => {
								const dmConv = conversations.find((c) => !c.is_group && otherUserId(c) === m.id);
								const dmUnread = dmConv ? unread[dmConv.id] ?? 0 : 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openDM(m.id),
									className: "mb-0.5 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-all hover:bg-accent/70",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
												name: m.full_name,
												admin: m.role === "admin",
												size: 36,
												url: m.avatar_url,
												online: onlineUsers.has(m.id)
											}), dmUnread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "absolute -right-1 -top-1 flex h-2.5 w-2.5 items-center justify-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-background" })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `truncate ${dmUnread > 0 ? "font-semibold" : "font-medium"}`,
														children: m.full_name
													}),
													m.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgePill, {
														label: m.badge,
														size: "xs"
													}),
													m.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "ml-auto text-[9px]",
														children: "admin"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-xs text-muted-foreground",
												children: m.position
											})]
										}),
										dmUnread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-1 inline-flex min-w-[20px] items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white",
											children: dmUnread > 99 ? "99+" : dmUnread
										})
									]
								}, m.id);
							})
						]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-background/70 ${activeId ? "flex" : "hidden md:flex"}`,
				children: activeConv ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 border-b border-border/60 bg-white/70 px-4 py-3 text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => setActiveId(null),
								"aria-label": "Back to conversations",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								name: conversationLabel(activeConv),
								group: activeConv.is_group,
								admin: conversationAdmin(activeConv),
								size: 40,
								online: !activeConv.is_group && dmIsOnline,
								url: !activeConv.is_group ? teamById.get(otherUserId(activeConv) ?? "")?.avatar_url : null
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm font-semibold",
										children: conversationLabel(activeConv)
									}), conversationBadge(activeConv) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgePill, {
										label: conversationBadge(activeConv),
										size: "xs"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1.5 text-xs text-muted-foreground",
									children: activeConv.is_group ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }),
										(convMembers[activeConv.id] ?? []).length,
										" members",
										onlineUsers.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											" · ",
											onlineUsers.size,
											" online"
										] })
									] }) : dmIsOnline ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" }), "Online now"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-slate-400" }), "Offline"] })
								})]
							}),
							activeConv.is_group && user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => setManageOpen(true),
								"aria-label": "Manage group",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-4 w-4" })
							}),
							user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								"aria-label": mutes[activeConv.id] ? "Unmute" : "Mute",
								title: mutes[activeConv.id] ? "Unmute notifications" : "Mute notifications",
								onClick: async () => {
									const next = !mutes[activeConv.id];
									setMutes((m) => ({
										...m,
										[activeConv.id]: next
									}));
									try {
										await toggleMuteConversation(activeConv.id, next);
									} catch (e) {
										setMutes((m) => ({
											...m,
											[activeConv.id]: !next
										}));
										toast.error(e instanceof Error ? e.message : "Failed");
									}
								},
								children: mutes[activeConv.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "h-4 w-4 text-amber-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => setInChatSearch((v) => !v),
								"aria-label": "Search in chat",
								className: "hidden sm:inline-flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: openStarredPanel,
								"aria-label": "Starred messages",
								className: "hidden sm:inline-flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4" })
							})
						]
					}),
					inChatSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border/60 bg-white/60 px-4 py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							autoFocus: true,
							value: inChatQuery,
							onChange: (e) => setInChatQuery(e.target.value),
							placeholder: "Search in this conversation…",
							className: "h-9 bg-background/80"
						})
					}),
					pinned.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border/60 bg-amber-50/70 px-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-amber-700",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3 w-3" }),
								" Pinned (",
								pinned.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 flex gap-2 overflow-x-auto",
							children: pinned.slice(0, 5).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									const el = document.getElementById(`msg-${p.id}`);
									el?.scrollIntoView({
										behavior: "smooth",
										block: "center"
									});
									el?.classList.add("ring-2", "ring-amber-400");
									setTimeout(() => el?.classList.remove("ring-2", "ring-amber-400"), 1400);
								},
								className: "max-w-[240px] shrink-0 truncate rounded-md border border-amber-200 bg-white/80 px-2 py-1 text-left text-xs text-slate-700 hover:bg-white",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-amber-700",
										children: [teamById.get(p.sender_id)?.full_name?.split(" ")[0] ?? "Msg", ":"]
									}),
									" ",
									p.deleted_at ? "(deleted)" : parseEffect(p.content).text || "(attachment)"
								]
							}, p.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: scrollRef,
						role: "log",
						"aria-live": "polite",
						"aria-relevant": "additions",
						"aria-label": "Conversation messages",
						className: "flex-1 space-y-3 overflow-y-auto p-4",
						style: { backgroundImage: "radial-gradient(circle at 20% 10%, rgba(59,130,246,0.06), transparent 40%), radial-gradient(circle at 80% 90%, rgba(15,27,61,0.05), transparent 45%)" },
						children: [
							hasMoreOlder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-center pb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									disabled: loadingOlder,
									onClick: async () => {
										if (!activeId || messages.length === 0) return;
										setLoadingOlder(true);
										try {
											const older = await fetchOlderMessages(activeId, messages[0].created_at);
											setMessages((prev) => [...older, ...prev]);
											if (older.length < 50) setHasMoreOlder(false);
										} finally {
											setLoadingOlder(false);
										}
									},
									children: loadingOlder ? "Loading…" : "Load older messages"
								})
							}),
							messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-12 text-center text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "mx-auto mb-2 h-8 w-8 opacity-40" }), "No messages yet. Say hi 👋"]
							}),
							visibleMessages.map((m, idx) => {
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
								const fxIcon = fx ? MESSAGE_EFFECTS.find((e) => e.id === fx)?.icon ?? "" : "";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GestureWrapper, {
									onSwipeLeft: () => setReplyTo(m),
									onLongPress: () => {
										document.querySelector(`#msg-${m.id} .msg-react-btn`)?.click();
									},
									onTap: (e) => {
										const target = e.target;
										if (target.closest("button") || target.closest("a") || target.closest("input")) return;
										document.querySelector(`#msg-${m.id} .msg-options-btn`)?.click();
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										id: `msg-${m.id}`,
										className: `group/msg flex items-end gap-2 ${mine ? "justify-end" : "justify-start"} rounded-lg transition-shadow`,
										children: [!mine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8",
											children: showAvatar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
												name: sender?.full_name ?? "?",
												admin: sender?.role === "admin",
												size: 32,
												url: sender?.avatar_url
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `relative max-w-[75%] px-3.5 py-2 text-sm shadow-sm ${mine ? "rounded-2xl rounded-br-sm bg-gradient-to-br from-brand to-brand-accent text-white" : "rounded-2xl rounded-bl-sm border border-border/60 bg-background"} ${isDeleted ? "italic opacity-70" : ""} ${mentioned && !mine ? "ring-2 ring-amber-300" : ""} ${fx && !isDeleted ? `msg-fx msg-fx-${fx}` : ""}`,
											children: [
												fx && !isDeleted && fxIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													"aria-hidden": true,
													className: "fx-layer",
													children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "fx-p",
														style: {
															left: `${(i * 12 + 6) % 100}%`,
															animationDelay: `${i * .3 % 2.4}s`,
															fontSize: `${12 + i * 3 % 10}px`
														},
														children: fxIcon
													}, i))
												}),
												!mine && activeConv.is_group && showAvatar && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-brand-accent",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sender?.full_name ?? "Member" }), sender?.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgePill, {
														label: sender.badge,
														size: "xs"
													})]
												}),
												m.pinned_at && !isDeleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `mb-1 flex items-center gap-1 text-[10px] font-semibold ${mine ? "text-white/80" : "text-amber-600"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3 w-3" }), " Pinned"]
												}),
												m.forwarded_from && !isDeleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `mb-1 flex items-center gap-1 text-[10px] italic ${mine ? "text-white/80" : "text-muted-foreground"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forward, { className: "h-3 w-3" }), " Forwarded"]
												}),
												parent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => {
														const el = document.getElementById(`msg-${parent.id}`);
														el?.scrollIntoView({
															behavior: "smooth",
															block: "center"
														});
														el?.classList.add("ring-2", "ring-brand-accent");
														setTimeout(() => el?.classList.remove("ring-2", "ring-brand-accent"), 1200);
													},
													className: `mb-1 block w-full truncate rounded-md border-l-2 px-2 py-1 text-left text-[11px] ${mine ? "border-white/60 bg-white/10 text-white/90" : "border-brand-accent bg-brand-accent/5 text-slate-700"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-semibold",
														children: [
															teamById.get(parent.sender_id)?.full_name?.split(" ")[0] ?? "Reply",
															":",
															" "
														]
													}), parent.deleted_at ? "(deleted)" : parseEffect(parent.content).text || "(attachment)"]
												}),
												isDeleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "whitespace-pre-wrap break-words",
													children: "This message was deleted"
												}) : isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: editingText,
														onChange: (e) => setEditingText(e.target.value),
														onKeyDown: (e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																handleEditSave(m.id);
															}
															if (e.key === "Escape") setEditingId(null);
														},
														autoFocus: true,
														className: "h-8 bg-white/90 text-slate-900"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: "secondary",
															className: "h-6 px-2 text-xs",
															onClick: () => handleEditSave(m.id),
															children: "Save"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: "ghost",
															className: "h-6 px-2 text-xs",
															onClick: () => setEditingId(null),
															children: "Cancel"
														})]
													})]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													atts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `mb-1 grid gap-1.5 ${atts.length > 1 ? "grid-cols-2" : "grid-cols-1"}`,
														children: atts.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttachmentView, {
															att: a,
															mine,
															onOpenImage: setLightboxUrl
														}, i))
													}),
													fxText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "whitespace-pre-wrap break-words",
														children: renderContentWithMentions(fxText, team, mine)
													}),
													linkUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkPreview, {
														url: linkUrl,
														mine
													})
												] }),
												rEntries.length > 0 && !isDeleted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1.5 flex flex-wrap gap-1",
													children: rEntries.map(([emoji, users]) => {
														return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															type: "button",
															onClick: () => handleReactionToggle(m.id, emoji),
															className: `inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] transition-colors ${(user ? users.includes(user.id) : false) ? "border-brand-accent bg-brand-accent/15 text-brand-accent" : mine ? "border-white/30 bg-white/15 text-white/90 hover:bg-white/25" : "border-border bg-muted/50 text-slate-700 hover:bg-muted"}`,
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: emoji }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: users.length })]
														}, emoji);
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `mt-1 flex items-center gap-1 text-[10px] ${mine ? "text-white/70" : "text-muted-foreground"}`,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															title: new Date(m.created_at).toLocaleString(),
															children: formatRelative(m.created_at)
														}),
														m.edited_at && !isDeleted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "· edited" }),
														isStarred && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-current" }),
														mine && !isDeleted && (allReadByOthers(m) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 opacity-70" }))
													]
												}),
												!isDeleted && !isEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `absolute -top-3 ${mine ? "right-1" : "left-1"} flex items-center gap-0.5 rounded-full bg-white/95 px-0.5 shadow ring-1 ring-black/5 opacity-0 transition-opacity group-hover/msg:opacity-100`,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
															asChild: true,
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																className: "msg-react-btn rounded-full p-1 text-slate-700 hover:bg-accent",
																"aria-label": "React",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "h-3.5 w-3.5" })
															})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
															side: "top",
															align: mine ? "end" : "start",
															className: "w-auto p-1",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "flex gap-0.5",
																children: QUICK_REACTIONS.map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	type: "button",
																	onClick: () => handleReactionToggle(m.id, emoji),
																	className: "rounded-md p-1 text-lg hover:bg-accent",
																	children: emoji
																}, emoji))
															})
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "rounded-full p-1 text-slate-700 hover:bg-accent",
															"aria-label": "Reply",
															onClick: () => setReplyTo(m),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reply, { className: "h-3.5 w-3.5" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
															asChild: true,
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																className: "msg-options-btn rounded-full p-1 text-slate-700 hover:bg-accent",
																"aria-label": "Message actions",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-3.5 w-3.5" })
															})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
															align: mine ? "end" : "start",
															className: "w-44",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
																	onSelect: () => setReplyTo(m),
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reply, { className: "mr-2 h-3.5 w-3.5" }), " Reply"]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
																	onSelect: () => handleToggleStar(m.id),
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `mr-2 h-3.5 w-3.5 ${isStarred ? "fill-current text-amber-500" : ""}` }),
																		" ",
																		isStarred ? "Unstar" : "Star"
																	]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
																	onSelect: () => handleTogglePin(m),
																	children: m.pinned_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinOff, { className: "mr-2 h-3.5 w-3.5" }), " Unpin"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "mr-2 h-3.5 w-3.5" }), " Pin"] })
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
																	onSelect: () => setForwardMessage(m),
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forward, { className: "mr-2 h-3.5 w-3.5" }), " Forward"]
																}),
																fxText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
																	onSelect: () => {
																		navigator.clipboard.writeText(fxText);
																		toast.success("Copied");
																	},
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "mr-2 h-3.5 w-3.5" }), " Copy text"]
																}),
																mine && fxText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
																	onSelect: () => {
																		setEditingId(m.id);
																		setEditingText(fxText);
																	},
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-3.5 w-3.5" }), " Edit"]
																})] }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
																	onSelect: () => handleDeleteForMe(m.id),
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-3.5 w-3.5" }), " Delete for me"]
																}),
																mine && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
																	className: "text-destructive focus:text-destructive",
																	onSelect: () => handleDelete(m.id),
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-3.5 w-3.5" }), " Delete for everyone"]
																})
															]
														})] })
													]
												})
											]
										})]
									})
								}, m.id);
							}),
							typingNames.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex gap-0.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-1.5 w-1.5 animate-bounce rounded-full bg-brand-accent",
											style: { animationDelay: "0ms" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-1.5 w-1.5 animate-bounce rounded-full bg-brand-accent",
											style: { animationDelay: "120ms" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-1.5 w-1.5 animate-bounce rounded-full bg-brand-accent",
											style: { animationDelay: "240ms" }
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									typingNames.slice(0, 2).join(", "),
									typingNames.length > 2 ? ` +${typingNames.length - 2}` : "",
									" typing…"
								] })]
							})
						]
					}),
					replyTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 border-t border-border/60 bg-brand-accent/5 px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reply, { className: "mt-0.5 h-4 w-4 shrink-0 text-brand-accent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] font-semibold text-brand-accent",
									children: ["Replying to ", teamById.get(replyTo.sender_id)?.full_name ?? "message"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-xs text-muted-foreground",
									children: replyTo.deleted_at ? "(deleted)" : parseEffect(replyTo.content).text || "(attachment)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setReplyTo(null),
								className: "rounded-full p-1 hover:bg-accent",
								"aria-label": "Cancel reply",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
							})
						]
					}),
					recording && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 border-t border-border/60 bg-red-50 px-3 py-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium text-red-700",
								children: ["Recording ", fmtSec(recordSeconds)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: cancelRecording,
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: stopRecording,
									className: "bg-red-600 hover:bg-red-700 text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "mr-1 h-3.5 w-3.5" }), " Stop"]
								})]
							})
						]
					}),
					pendingFiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2 border-t border-border/60 bg-muted/40 p-2",
						children: pendingFiles.map((f, i) => {
							const isImg = f.type.startsWith("image/");
							const isVid = f.type.startsWith("video/");
							const isAud = f.type.startsWith("audio/");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group relative flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5 text-xs shadow-sm",
								children: [
									isImg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-3.5 w-3.5 text-brand-accent" }) : isVid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "h-3.5 w-3.5 text-brand-accent" }) : isAud ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3.5 w-3.5 text-brand-accent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-brand-accent" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "max-w-[160px] truncate",
										children: f.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPendingFiles((prev) => prev.filter((_, idx) => idx !== i)),
										className: "rounded-full p-0.5 hover:bg-accent",
										"aria-label": "Remove",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									})
								]
							}, i);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex items-center gap-2 border-t border-border/60 bg-background/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur",
						onSubmit: (e) => {
							e.preventDefault();
							handleSend();
						},
						"aria-label": "Send a message",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileInputRef,
								type: "file",
								multiple: true,
								accept: "image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.csv",
								className: "hidden",
								onChange: onPickFiles
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon",
								onClick: () => fileInputRef.current?.click(),
								disabled: uploading || recording,
								"aria-label": "Attach files",
								className: "rounded-full text-muted-foreground hover:text-brand",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmojiPicker, {
								onPick: (emoji) => setInput((prev) => prev + emoji),
								disabled: uploading
							}),
							profile?.badge === "Developer" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "icon",
									disabled: uploading,
									"aria-label": "Message effect",
									title: pendingEffect ? `Effect: ${pendingEffect}` : "Add message effect (dev only)",
									className: `fx-picker-btn rounded-full ${pendingEffect ? "text-brand-accent" : "text-muted-foreground hover:text-brand"}`,
									children: pendingEffect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base leading-none",
										children: MESSAGE_EFFECTS.find((e) => e.id === pendingEffect)?.icon
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-4 w-4" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
								side: "top",
								align: "start",
								className: "w-64 p-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1 flex items-center justify-between px-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-semibold text-slate-700",
											children: "Developer effects"
										}), pendingEffect && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setPendingEffect(null),
											className: "text-[10px] text-muted-foreground hover:text-destructive",
											children: "Clear"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-4 gap-1",
										children: MESSAGE_EFFECTS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setPendingEffect(e.id),
											className: `flex flex-col items-center gap-0.5 rounded-md p-2 text-[10px] transition hover:bg-accent ${pendingEffect === e.id ? "bg-brand-accent/10 ring-1 ring-brand-accent" : ""}`,
											title: e.label,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xl leading-none",
												children: e.icon
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-700",
												children: e.label
											})]
										}, e.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 rounded-md bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground",
										children: "Preview: your next message bubble will animate with the chosen effect."
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon",
								onClick: recording ? stopRecording : startRecording,
								disabled: uploading,
								"aria-label": recording ? "Stop recording" : "Record voice",
								className: `rounded-full ${recording ? "text-red-600" : "text-muted-foreground hover:text-brand"}`,
								children: recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: input,
								onChange: (e) => {
									setInput(e.target.value);
								},
								placeholder: uploading ? "Uploading…" : recording ? "Recording…" : "Type a message… (use @ to mention)",
								autoFocus: true,
								disabled: uploading,
								"aria-label": "Message",
								className: "h-11 rounded-full border-border/70 bg-muted/40 px-4 text-base sm:text-sm focus-visible:ring-brand/40"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: uploading || recording || !input.trim() && pendingFiles.length === 0,
								"aria-label": "Send message",
								className: "h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-brand to-brand-accent p-0 shadow-md hover:opacity-95",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
							})
						]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-1 items-center justify-center p-8 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-accent text-white shadow-lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-7 w-7" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-lg font-semibold",
								children: "Your conversations live here"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Select a chat from the left or start a new group to get talking with your team."
							})
						]
					})
				})
			})]
		}),
		activeConv?.is_group && user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManageGroupDialog, {
			open: manageOpen,
			onOpenChange: setManageOpen,
			conversation: activeConv,
			memberIds: convMembers[activeConv.id] ?? [],
			team,
			currentUserId: user.id,
			onChanged: reloadConversations,
			onLeave: handleLeaveGroup
		}),
		forwardMessage && user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!forwardMessage,
			onOpenChange: (v) => {
				if (!v) setForwardMessage(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Forward message" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-72 space-y-1 overflow-y-auto",
				children: conversations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handleForwardTo(c.id),
					className: "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							name: conversationLabel(c),
							group: c.is_group,
							admin: conversationAdmin(c),
							size: 28,
							url: otherUserId(c) ? teamById.get(otherUserId(c) ?? "")?.avatar_url : null
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 truncate",
							children: conversationLabel(c)
						}),
						c.is_group && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[9px]",
							children: "group"
						})
					]
				}, c.id))
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showStarredPanel,
			onOpenChange: setShowStarredPanel,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Starred messages" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-96 space-y-2 overflow-y-auto",
					children: [starredMessages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-8 text-center text-sm text-muted-foreground",
						children: "No starred messages yet."
					}), starredMessages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-muted/30 p-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex items-center justify-between text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-slate-700",
									children: teamById.get(m.sender_id)?.full_name ?? "Member"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									title: new Date(m.created_at).toLocaleString(),
									children: formatRelative(m.created_at)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "whitespace-pre-wrap break-words",
								children: m.deleted_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "(deleted)" }) : m.content || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "(attachment)" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => {
										setActiveId(m.conversation_id);
										setShowStarredPanel(false);
										setTimeout(() => document.getElementById(`msg-${m.id}`)?.scrollIntoView({
											behavior: "smooth",
											block: "center"
										}), 400);
									},
									children: "Go to message"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => handleToggleStar(m.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "mr-1 h-3.5 w-3.5 fill-current text-amber-500" }), " Unstar"]
								})]
							})
						]
					}, m.id))]
				})]
			})
		}),
		lightboxUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in",
			onClick: () => setLightboxUrl(null),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close",
					className: "absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20",
					onClick: (e) => {
						e.stopPropagation();
						setLightboxUrl(null);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: lightboxUrl,
					alt: "Full view",
					className: "max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl",
					onClick: (e) => e.stopPropagation()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: lightboxUrl,
					download: true,
					target: "_blank",
					rel: "noreferrer",
					onClick: (e) => e.stopPropagation(),
					className: "absolute bottom-4 rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20",
					children: "Open in new tab"
				})
			]
		})
	] });
}
var QUICK_REACTIONS = [
	"👍",
	"❤️",
	"😂",
	"😮",
	"😢",
	"🙏",
	"🔥"
];
function renderContentWithMentions(text, team, mine) {
	const parts = [];
	const re = /@([\p{L}][\p{L}0-9._-]{1,40})/gu;
	let lastIdx = 0;
	let match;
	let key = 0;
	while (match = re.exec(text)) {
		if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
		const token = match[1].toLowerCase();
		const hit = team.find((t) => {
			const first = (t.full_name.split(" ")[0] ?? "").toLowerCase();
			const full = t.full_name.toLowerCase().replace(/\s+/g, "");
			return token === first || token === full;
		});
		if (hit) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: `rounded px-1 font-semibold ${mine ? "bg-white/25 text-white" : "bg-brand-accent/15 text-brand-accent"}`,
			children: ["@", hit.full_name.split(" ")[0]]
		}, `m-${key++}`));
		else parts.push(match[0]);
		lastIdx = match.index + match[0].length;
	}
	if (lastIdx < text.length) parts.push(text.slice(lastIdx));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: parts });
}
function LinkPreview({ url, mine }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: url,
		target: "_blank",
		rel: "noreferrer",
		className: `mt-1.5 flex items-center gap-2 rounded-md border px-2 py-1.5 text-[11px] transition-colors ${mine ? "border-white/30 bg-white/10 text-white/90 hover:bg-white/20" : "border-border bg-muted/40 text-slate-700 hover:bg-muted"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: url
		})]
	});
}
var EMOJI_GROUPS = [
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
			"🙏"
		]
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
			"❗"
		]
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
			"🚀"
		]
	}
];
function GestureWrapper({ children, onSwipeLeft, onLongPress, onTap }) {
	const [translateX, setTranslateX] = (0, import_react.useState)(0);
	const startX = (0, import_react.useRef)(null);
	const startY = (0, import_react.useRef)(null);
	const startTime = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(null);
	const isSwiping = (0, import_react.useRef)(false);
	const isLongPressTriggered = (0, import_react.useRef)(false);
	const handlePointerDown = (e) => {
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
	const handlePointerMove = (e) => {
		if (startX.current === null || startY.current === null) return;
		const dx = e.clientX - startX.current;
		const dy = e.clientY - startY.current;
		if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
			if (timerRef.current) clearTimeout(timerRef.current);
		}
		if (!isSwiping.current && dx < -10 && Math.abs(dx) > Math.abs(dy)) isSwiping.current = true;
		if (isSwiping.current && dx < 0) setTranslateX(Math.max(-60, dx));
	};
	const handlePointerUp = (e) => {
		if (timerRef.current) clearTimeout(timerRef.current);
		if (startX.current !== null && startTime.current !== null) {
			const dx = e.clientX - startX.current;
			const dy = e.clientY - (startY.current ?? e.clientY);
			const dt = Date.now() - startTime.current;
			if (isSwiping.current && dx < -40) onSwipeLeft();
			else if (!isSwiping.current && !isLongPressTriggered.current && Math.abs(dx) < 10 && Math.abs(dy) < 10 && dt < 500) onTap(e);
		}
		startX.current = null;
		startY.current = null;
		startTime.current = null;
		isSwiping.current = false;
		isLongPressTriggered.current = false;
		setTranslateX(0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		onPointerDown: handlePointerDown,
		onPointerMove: handlePointerMove,
		onPointerUp: handlePointerUp,
		onPointerCancel: handlePointerUp,
		onContextMenu: (e) => {
			if (window.matchMedia("(max-width: 768px)").matches) e.preventDefault();
		},
		style: { transform: `translateX(${translateX}px)` },
		className: "transition-transform duration-200 ease-out will-change-transform touch-pan-y",
		children
	});
}
function EmojiPicker({ onPick, disabled }) {
	const [tab, setTab] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "ghost",
			size: "icon",
			disabled,
			"aria-label": "Insert emoji",
			className: "rounded-full text-muted-foreground hover:text-brand",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "h-4 w-4" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
		align: "start",
		side: "top",
		className: "w-72 p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 flex gap-1",
			children: EMOJI_GROUPS.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab(i),
				className: `flex-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${tab === i ? "bg-brand/10 text-brand" : "text-muted-foreground hover:bg-accent"}`,
				children: g.label
			}, g.label))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid max-h-56 grid-cols-8 gap-1 overflow-y-auto",
			children: EMOJI_GROUPS[tab].emojis.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onPick(e),
				className: "rounded-md p-1 text-xl leading-none transition-transform hover:scale-110 hover:bg-accent",
				children: e
			}, e))
		})]
	})] });
}
function NewGroupDialog({ open, onOpenChange, team, onCreate }) {
	const [name, setName] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: (v) => {
			onOpenChange(v);
			if (!v) {
				setName("");
				setSelected(/* @__PURE__ */ new Set());
			}
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				className: "h-8 rounded-full border border-white/30 bg-white/15 px-3 text-white hover:bg-white/25",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-3 w-3" }), " Group"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New group" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Group name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "e.g. Marketing squad"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Members" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-56 space-y-1 overflow-y-auto rounded-md border border-border p-2",
						children: team.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: selected.has(m.id),
									onCheckedChange: (v) => {
										const next = new Set(selected);
										if (v) next.add(m.id);
										else next.delete(m.id);
										setSelected(next);
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex-1",
									children: [
										m.full_name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: ["— ", m.position]
										})
									]
								}),
								m.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px]",
									children: "admin"
								})
							]
						}, m.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: !name.trim() || selected.size === 0 || busy,
				onClick: async () => {
					setBusy(true);
					try {
						await onCreate(name.trim(), Array.from(selected));
					} finally {
						setBusy(false);
					}
				},
				children: "Create group"
			}) })
		] })]
	});
}
function ManageGroupDialog({ open, onOpenChange, conversation, memberIds, team, currentUserId, onChanged, onLeave }) {
	const [name, setName] = (0, import_react.useState)(conversation.name ?? "");
	const [toAdd, setToAdd] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [busy, setBusy] = (0, import_react.useState)(false);
	const isCreator = conversation.created_by === currentUserId;
	(0, import_react.useEffect)(() => {
		if (open) {
			setName(conversation.name ?? "");
			setToAdd(/* @__PURE__ */ new Set());
		}
	}, [
		open,
		conversation.id,
		conversation.name
	]);
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
		} catch (e) {
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
			setToAdd(/* @__PURE__ */ new Set());
			await onChanged();
			toast.success("Members added");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to add");
		} finally {
			setBusy(false);
		}
	}
	async function removeMember(uid) {
		if (!confirm("Remove this member from the group?")) return;
		setBusy(true);
		try {
			await removeGroupMember(conversation.id, uid);
			await onChanged();
			toast.success("Member removed");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to remove");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Manage group" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Group name" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: name,
										onChange: (e) => setName(e.target.value),
										disabled: !isCreator || busy
									}), isCreator && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: saveName,
										disabled: busy || !name.trim() || name.trim() === (conversation.name ?? ""),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1 h-4 w-4" }), " Save"]
									})]
								}),
								!isCreator && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Only the creator can rename this group."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
								"Members (",
								currentMembers.length,
								")"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-48 space-y-1 overflow-y-auto rounded-md border border-border p-2",
								children: currentMembers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded px-2 py-1.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex-1",
										children: [
											m.full_name,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: ["— ", m.position]
											}),
											m.id === conversation.created_by && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "ml-2 text-[9px]",
												children: "creator"
											})
										]
									}), isCreator && m.id !== currentUserId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										onClick: () => removeMember(m.id),
										disabled: busy,
										"aria-label": "Remove member",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
									})]
								}, m.id))
							})]
						}),
						nonMembers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Add members" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "max-h-40 space-y-1 overflow-y-auto rounded-md border border-border p-2",
									children: nonMembers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: toAdd.has(m.id),
											onCheckedChange: (v) => {
												const next = new Set(toAdd);
												if (v) next.add(m.id);
												else next.delete(m.id);
												setToAdd(next);
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex-1",
											children: [
												m.full_name,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs text-muted-foreground",
													children: ["— ", m.position]
												})
											]
										})]
									}, m.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: addSelected,
									disabled: busy || toAdd.size === 0,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-1 h-4 w-4" }),
										" Add ",
										toAdd.size > 0 ? `(${toAdd.size})` : ""
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "justify-between sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "destructive",
						onClick: onLeave,
						disabled: busy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-1 h-4 w-4" }), " Leave group"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => onOpenChange(false),
						children: "Done"
					})]
				})
			]
		})
	});
}
function AttachmentView({ att, mine, onOpenImage }) {
	const url = att.url;
	if (att.kind === "image") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => onOpenImage?.(url),
		className: "block overflow-hidden rounded-lg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: url,
			alt: att.name,
			className: "max-h-64 w-full cursor-zoom-in object-cover transition-transform hover:scale-[1.01]",
			loading: "lazy"
		})
	});
	if (att.kind === "video") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		src: url,
		controls: true,
		className: "max-h-64 w-full rounded-lg bg-black"
	});
	if (att.kind === "audio") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center gap-2 rounded-lg px-2.5 py-2 ${mine ? "bg-white/10" : "bg-muted/40"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: `h-4 w-4 shrink-0 ${mine ? "text-white/80" : "text-brand-accent"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
			src: url,
			controls: true,
			className: "h-8 w-full max-w-[220px]"
		})]
	});
	if (att.kind === "file" && (att.name.toLowerCase().endsWith(".pdf") || att.mime === "application/pdf")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `overflow-hidden rounded-lg border ${mine ? "border-white/30 bg-white/10" : "border-border bg-background"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("object", {
			data: url,
			type: "application/pdf",
			className: "h-64 w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: url,
				target: "_blank",
				rel: "noreferrer",
				className: "flex items-center gap-2 p-2 text-xs underline",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }),
					" ",
					att.name
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: url,
			target: "_blank",
			rel: "noreferrer",
			download: att.name,
			className: `flex items-center gap-2 border-t px-2.5 py-1.5 text-xs ${mine ? "border-white/20" : "border-border"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 shrink-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 flex-1 truncate",
					children: att.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "opacity-70",
					children: [(att.size / 1024).toFixed(0), " KB"]
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: url,
		target: "_blank",
		rel: "noreferrer",
		download: att.name,
		className: `flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs ${mine ? "border-white/30 bg-white/10" : "border-border bg-background"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 shrink-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0 flex-1 truncate",
				children: att.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "opacity-70",
				children: [(att.size / 1024).toFixed(0), " KB"]
			})
		]
	});
}
//#endregion
export { ChatPage as component };
