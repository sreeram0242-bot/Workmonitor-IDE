import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { i as __exportAll } from "./dist-CU7AhyVe.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BDx8PeYO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks-CQ010v_B.js
var fetchTeam$1 = createServerFn({ method: "GET" }).handler(createSsrRpc("c7f1f0c049056233c9214ad46ff15c9f7075acaeab513d8ded864b0fdc1968cd"));
var fetchTasksForAdmin$1 = createServerFn({ method: "GET" }).handler(createSsrRpc("bac0ba4dc15c41e6c9e654f28ca77f649221adea07b73a30f96d0fa689835f76"));
var fetchTasksForUser$1 = createServerFn({ method: "GET" }).validator((userId) => userId).handler(createSsrRpc("3b3bd7af8b7278c26eddc0ff06861dcd977ef39bafe9aeedb7bc02c970101d56"));
var fetchProofsForTask$1 = createServerFn({ method: "GET" }).validator((taskId) => taskId).handler(createSsrRpc("3d218b509dda1a0016197a39123a1410246892cf9469e3eadcb85ba818291645"));
var fetchSubtasks$1 = createServerFn({ method: "GET" }).validator((taskId) => taskId).handler(createSsrRpc("67e324d32e3816029ffdad466126af1ae054a8c2ce97140eb1988320cda2b476"));
var addSubtask$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("a03ef1ffb511e0d40843fd7a1277e2706b3c53b9a5a21d5a77221df3365b8002"));
var toggleSubtask$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("232687a4f723bed64094085377be6f856849fd887ea77f8368ba49bc7c06885d"));
var renameSubtask$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("c221f3fe01a55a90d9ee35d65172791b63ba91c2ada567d8494fd1cb5f86099b"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("de9fbb57adaf11ca2568dcd99fad51e158aa698503e77ad0479fa26395a7d593"));
var deleteSubtask$1 = createServerFn({ method: "POST" }).validator((id) => id).handler(createSsrRpc("cd22269938bbff015d126f40ac507493b3965a4ac6394976e55e562b89fa955d"));
var bulkApproveTasks$1 = createServerFn({ method: "POST" }).validator((ids) => ids).handler(createSsrRpc("dc30eb61c08b59b9bc1c9333e03e10d3e8c81ba4a30a13599625841e2fd18fa8"));
var bulkDeleteTasks$1 = createServerFn({ method: "POST" }).validator((ids) => ids).handler(createSsrRpc("32e4520eb2c5a8152a5394148639de44c11953fc6925f27c35ebfc9e1ac84a0d"));
var bulkReassignTasks$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("e90fc8e7e41e8341715316a4b08c03ebd87474fd424ad77405e46f46d54a1b52"));
var createTask$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("168fc3a56d98a0e408f6604ceb6aa335c855e4ad5c02faeb94baad83adcd41f0"));
var updateTask$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("1d141bdf486d86a01c138a57fa53572dc59ab8d109fec9a8b614394ec4187e5c"));
var deleteTask$1 = createServerFn({ method: "POST" }).validator((id) => id).handler(createSsrRpc("527258e10a691688ff2da136d32112c8d4de019c9de5d61ed09ff0730d032f7b"));
var submitTaskProof$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("0d815090e8cf47634456fae3ba74ed2d4aba1432e6756649a24e60b8e01aeb26"));
var fetchTaskComments$1 = createServerFn({ method: "GET" }).validator((taskId) => taskId).handler(createSsrRpc("01b56f9d44bc30538680091d8927225a12cc5687bfdf8febd6e023480c121ac3"));
var addTaskComment$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("8a5916d0eb783b00333edfc8f83ea803085ebfacd0e0cbdd28574aef9d88b2ad"));
var deleteTaskComment$1 = createServerFn({ method: "POST" }).validator((id) => id).handler(createSsrRpc("ba81ae2121290869a0c9d5272316c09999e7674523522d2a2c2a71c54a381d6c"));
var fetchReminders$1 = createServerFn({ method: "GET" }).handler(createSsrRpc("384e02b0882994cd47370ffe136f8002822e00acd1da2313c06b35261f6e5a75"));
var addReminder$1 = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("3bce7d16c503de62179a0131904bdb00ec076d9de1ce4b64bd66d3d8e563d3a5"));
var tasks_exports = /* @__PURE__ */ __exportAll({
	addReminder: () => addReminder,
	addSubtask: () => addSubtask,
	addTaskComment: () => addTaskComment,
	bulkApproveTasks: () => bulkApproveTasks,
	bulkDeleteTasks: () => bulkDeleteTasks,
	bulkReassignTasks: () => bulkReassignTasks,
	createTask: () => createTask,
	deleteSubtask: () => deleteSubtask,
	deleteTask: () => deleteTask,
	deleteTaskComment: () => deleteTaskComment,
	fetchProofsForTask: () => fetchProofsForTask,
	fetchReminders: () => fetchReminders,
	fetchSubtasks: () => fetchSubtasks,
	fetchTaskComments: () => fetchTaskComments,
	fetchTasksForAdmin: () => fetchTasksForAdmin,
	fetchTasksForUser: () => fetchTasksForUser,
	fetchTeam: () => fetchTeam,
	getCachedAdminTasks: () => getCachedAdminTasks,
	getCachedTeam: () => getCachedTeam,
	getCachedUserTasks: () => getCachedUserTasks,
	priorityColor: () => priorityColor,
	renameSubtask: () => renameSubtask,
	signedProofUrl: () => signedProofUrl,
	statusColor: () => statusColor,
	submitTaskProof: () => submitTaskProof,
	toggleSubtask: () => toggleSubtask,
	updateTask: () => updateTask
});
var _teamCache = null;
var TEAM_TTL_MS = 3e4;
async function fetchTeam(force = false) {
	if (!force && _teamCache && Date.now() - _teamCache.at < TEAM_TTL_MS) return _teamCache.data;
	const data = await fetchTeam$1();
	_teamCache = {
		at: Date.now(),
		data
	};
	return _teamCache.data;
}
var _adminTasksCache = null;
var _userTasksCache = /* @__PURE__ */ new Map();
function getCachedAdminTasks() {
	return _adminTasksCache;
}
function getCachedUserTasks(userId) {
	return _userTasksCache.get(userId) ?? null;
}
async function fetchTasksForAdmin() {
	_adminTasksCache = await fetchTasksForAdmin$1();
	return _adminTasksCache;
}
async function fetchTasksForUser(userId) {
	const rows = await fetchTasksForUser$1({ data: userId });
	_userTasksCache.set(userId, rows);
	return rows;
}
function getCachedTeam() {
	return _teamCache?.data ?? null;
}
async function fetchProofsForTask(taskId) {
	return await fetchProofsForTask$1({ data: taskId });
}
async function signedProofUrl(path) {
	return path;
}
function priorityColor(p) {
	return p === "high" ? "bg-red-500/10 text-red-500 border-red-500/20" : p === "medium" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
}
function statusColor(s) {
	return s === "approved" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : s === "completed" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : s === "revision" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : "bg-muted text-muted-foreground border-border";
}
async function fetchSubtasks(taskId) {
	return await fetchSubtasks$1({ data: taskId });
}
async function addSubtask(taskId, title, position) {
	return await addSubtask$1({ data: {
		taskId,
		title,
		position
	} });
}
async function toggleSubtask(id, isDone) {
	await toggleSubtask$1({ data: {
		id,
		isDone
	} });
}
async function renameSubtask(id, title) {
	await renameSubtask$1({ data: {
		id,
		title
	} });
}
async function deleteSubtask(id) {
	await deleteSubtask$1({ data: id });
}
async function bulkApproveTasks(ids) {
	return await bulkApproveTasks$1({ data: ids });
}
async function bulkDeleteTasks(ids) {
	return await bulkDeleteTasks$1({ data: ids });
}
async function bulkReassignTasks(ids, to) {
	return await bulkReassignTasks$1({ data: {
		ids,
		to
	} });
}
async function createTask(data) {
	return await createTask$1({ data });
}
async function updateTask(id, updates) {
	return await updateTask$1({ data: {
		id,
		updates
	} });
}
async function deleteTask(id) {
	return await deleteTask$1({ data: id });
}
async function submitTaskProof(taskId, fileBase64, fileName, note) {
	return await submitTaskProof$1({ data: {
		taskId,
		fileBase64,
		fileName,
		note
	} });
}
async function fetchTaskComments(taskId) {
	return await fetchTaskComments$1({ data: taskId });
}
async function addTaskComment(taskId, body) {
	return await addTaskComment$1({ data: {
		taskId,
		body
	} });
}
async function deleteTaskComment(id) {
	return await deleteTaskComment$1({ data: id });
}
async function fetchReminders() {
	return await fetchReminders$1();
}
async function addReminder(title, remindAt) {
	return await addReminder$1({ data: {
		title,
		remindAt: remindAt.toISOString()
	} });
}
//#endregion
export { signedProofUrl as C, toggleSubtask as D, tasks_exports as E, updateTask as O, renameSubtask as S, submitTaskProof as T, fetchTeam as _, bulkDeleteTasks as a, getCachedUserTasks as b, deleteSubtask as c, fetchProofsForTask as d, fetchReminders as f, fetchTasksForUser as g, fetchTasksForAdmin as h, bulkApproveTasks as i, deleteTask as l, fetchTaskComments as m, addSubtask as n, bulkReassignTasks as o, fetchSubtasks as p, addTaskComment as r, createTask as s, addReminder as t, deleteTaskComment as u, getCachedAdminTasks as v, statusColor as w, priorityColor as x, getCachedTeam as y };
