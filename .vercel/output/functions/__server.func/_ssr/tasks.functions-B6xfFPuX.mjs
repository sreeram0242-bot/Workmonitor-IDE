import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { n as createServerRpc, t as auth } from "./auth-CLHUWdtF.mjs";
import { t as broadcast } from "./ably.functions-Zufw-W-F.mjs";
import { t as prisma } from "./prisma-B-Q1fYN8.mjs";
import { t as require_cloudinary } from "../_libs/cloudinary+lodash.mjs";
var cloudinary = (/* @__PURE__ */ __toESM(require_cloudinary())).v2;
async function getAuthOrThrow() {
	const authResult = await auth();
	if (!authResult.userId) throw new Error("Unauthorized");
	return authResult;
}
var fetchTeam_createServerFn_handler = createServerRpc({
	id: "c7f1f0c049056233c9214ad46ff15c9f7075acaeab513d8ded864b0fdc1968cd",
	name: "fetchTeam",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => fetchTeam.__executeServer(opts));
var fetchTeam = createServerFn({ method: "GET" }).handler(fetchTeam_createServerFn_handler, async () => {
	await getAuthOrThrow();
	const profiles = await prisma.profile.findMany();
	const roles = await prisma.userRole.findMany();
	const roleMap = new Map(roles.map((r) => [r.user_id, r.role]));
	return profiles.map((p) => ({
		id: p.id,
		full_name: p.full_name,
		position: p.position,
		avatar_url: p.avatar_url,
		badge: p.badge,
		role: roleMap.get(p.id) || "user"
	}));
});
var fetchTasksForAdmin_createServerFn_handler = createServerRpc({
	id: "bac0ba4dc15c41e6c9e654f28ca77f649221adea07b73a30f96d0fa689835f76",
	name: "fetchTasksForAdmin",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => fetchTasksForAdmin.__executeServer(opts));
var fetchTasksForAdmin = createServerFn({ method: "GET" }).handler(fetchTasksForAdmin_createServerFn_handler, async () => {
	await getAuthOrThrow();
	return await prisma.task.findMany({ orderBy: { created_at: "desc" } });
});
var fetchTasksForUser_createServerFn_handler = createServerRpc({
	id: "3b3bd7af8b7278c26eddc0ff06861dcd977ef39bafe9aeedb7bc02c970101d56",
	name: "fetchTasksForUser",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => fetchTasksForUser.__executeServer(opts));
var fetchTasksForUser = createServerFn({ method: "GET" }).validator((userId) => userId).handler(fetchTasksForUser_createServerFn_handler, async ({ data: userId }) => {
	await getAuthOrThrow();
	return await prisma.task.findMany({
		where: { assigned_to: userId },
		orderBy: { created_at: "desc" }
	});
});
var fetchProofsForTask_createServerFn_handler = createServerRpc({
	id: "3d218b509dda1a0016197a39123a1410246892cf9469e3eadcb85ba818291645",
	name: "fetchProofsForTask",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => fetchProofsForTask.__executeServer(opts));
var fetchProofsForTask = createServerFn({ method: "GET" }).validator((taskId) => taskId).handler(fetchProofsForTask_createServerFn_handler, async ({ data: taskId }) => {
	await getAuthOrThrow();
	return await prisma.taskProof.findMany({
		where: { task_id: taskId },
		orderBy: { created_at: "desc" }
	});
});
var fetchSubtasks_createServerFn_handler = createServerRpc({
	id: "67e324d32e3816029ffdad466126af1ae054a8c2ce97140eb1988320cda2b476",
	name: "fetchSubtasks",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => fetchSubtasks.__executeServer(opts));
var fetchSubtasks = createServerFn({ method: "GET" }).validator((taskId) => taskId).handler(fetchSubtasks_createServerFn_handler, async ({ data: taskId }) => {
	await getAuthOrThrow();
	return await prisma.subtask.findMany({
		where: { task_id: taskId },
		orderBy: [{ position: "asc" }, { created_at: "asc" }]
	});
});
var addSubtask_createServerFn_handler = createServerRpc({
	id: "a03ef1ffb511e0d40843fd7a1277e2706b3c53b9a5a21d5a77221df3365b8002",
	name: "addSubtask",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => addSubtask.__executeServer(opts));
var addSubtask = createServerFn({ method: "POST" }).validator((data) => data).handler(addSubtask_createServerFn_handler, async ({ data: { taskId, title, position } }) => {
	await getAuthOrThrow();
	return await prisma.subtask.create({ data: {
		task_id: taskId,
		title,
		position
	} });
});
var toggleSubtask_createServerFn_handler = createServerRpc({
	id: "232687a4f723bed64094085377be6f856849fd887ea77f8368ba49bc7c06885d",
	name: "toggleSubtask",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => toggleSubtask.__executeServer(opts));
var toggleSubtask = createServerFn({ method: "POST" }).validator((data) => data).handler(toggleSubtask_createServerFn_handler, async ({ data: { id, isDone } }) => {
	await getAuthOrThrow();
	await prisma.subtask.update({
		where: { id },
		data: { is_done: isDone }
	});
	return true;
});
var renameSubtask_createServerFn_handler = createServerRpc({
	id: "c221f3fe01a55a90d9ee35d65172791b63ba91c2ada567d8494fd1cb5f86099b",
	name: "renameSubtask",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => renameSubtask.__executeServer(opts));
var renameSubtask = createServerFn({ method: "POST" }).validator((data) => data).handler(renameSubtask_createServerFn_handler, async ({ data: { id, title } }) => {
	await getAuthOrThrow();
	await prisma.subtask.update({
		where: { id },
		data: { title }
	});
	return true;
});
var updateSubtask_createServerFn_handler = createServerRpc({
	id: "de9fbb57adaf11ca2568dcd99fad51e158aa698503e77ad0479fa26395a7d593",
	name: "updateSubtask",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => updateSubtask.__executeServer(opts));
var updateSubtask = createServerFn({ method: "POST" }).validator((data) => data).handler(updateSubtask_createServerFn_handler, async ({ data: { id, updates } }) => {
	await getAuthOrThrow();
	await prisma.subtask.update({
		where: { id },
		data: updates
	});
	return true;
});
var deleteSubtask_createServerFn_handler = createServerRpc({
	id: "cd22269938bbff015d126f40ac507493b3965a4ac6394976e55e562b89fa955d",
	name: "deleteSubtask",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => deleteSubtask.__executeServer(opts));
var deleteSubtask = createServerFn({ method: "POST" }).validator((id) => id).handler(deleteSubtask_createServerFn_handler, async ({ data: id }) => {
	await getAuthOrThrow();
	await prisma.subtask.delete({ where: { id } });
	return true;
});
var bulkApproveTasks_createServerFn_handler = createServerRpc({
	id: "dc30eb61c08b59b9bc1c9333e03e10d3e8c81ba4a30a13599625841e2fd18fa8",
	name: "bulkApproveTasks",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => bulkApproveTasks.__executeServer(opts));
var bulkApproveTasks = createServerFn({ method: "POST" }).validator((ids) => ids).handler(bulkApproveTasks_createServerFn_handler, async ({ data: ids }) => {
	await getAuthOrThrow();
	await prisma.task.updateMany({
		where: { id: { in: ids } },
		data: {
			status: "approved",
			revision_note: null
		}
	});
	await broadcast("tasks", "task-updates", { type: "bulk_approve" });
	return true;
});
var bulkDeleteTasks_createServerFn_handler = createServerRpc({
	id: "32e4520eb2c5a8152a5394148639de44c11953fc6925f27c35ebfc9e1ac84a0d",
	name: "bulkDeleteTasks",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => bulkDeleteTasks.__executeServer(opts));
var bulkDeleteTasks = createServerFn({ method: "POST" }).validator((ids) => ids).handler(bulkDeleteTasks_createServerFn_handler, async ({ data: ids }) => {
	await getAuthOrThrow();
	await prisma.task.deleteMany({ where: { id: { in: ids } } });
	return true;
});
var bulkReassignTasks_createServerFn_handler = createServerRpc({
	id: "e90fc8e7e41e8341715316a4b08c03ebd87474fd424ad77405e46f46d54a1b52",
	name: "bulkReassignTasks",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => bulkReassignTasks.__executeServer(opts));
var bulkReassignTasks = createServerFn({ method: "POST" }).validator((data) => data).handler(bulkReassignTasks_createServerFn_handler, async ({ data: { ids, to } }) => {
	await getAuthOrThrow();
	await prisma.task.updateMany({
		where: { id: { in: ids } },
		data: { assigned_to: to }
	});
	return true;
});
var createTask_createServerFn_handler = createServerRpc({
	id: "168fc3a56d98a0e408f6604ceb6aa335c855e4ad5c02faeb94baad83adcd41f0",
	name: "createTask",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => createTask.__executeServer(opts));
var createTask = createServerFn({ method: "POST" }).validator((data) => data).handler(createTask_createServerFn_handler, async ({ data }) => {
	await getAuthOrThrow();
	const task = await prisma.task.create({ data });
	await broadcast("tasks", "task-updates", {
		type: "task_created",
		taskId: task.id
	});
	return task;
});
var updateTask_createServerFn_handler = createServerRpc({
	id: "1d141bdf486d86a01c138a57fa53572dc59ab8d109fec9a8b614394ec4187e5c",
	name: "updateTask",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => updateTask.__executeServer(opts));
var updateTask = createServerFn({ method: "POST" }).validator((data) => data).handler(updateTask_createServerFn_handler, async ({ data: { id, updates } }) => {
	await getAuthOrThrow();
	await prisma.task.update({
		where: { id },
		data: updates
	});
	await broadcast("tasks", "task-updates", {
		type: "task_updated",
		taskId: id
	});
	return true;
});
var deleteTask_createServerFn_handler = createServerRpc({
	id: "527258e10a691688ff2da136d32112c8d4de019c9de5d61ed09ff0730d032f7b",
	name: "deleteTask",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => deleteTask.__executeServer(opts));
var deleteTask = createServerFn({ method: "POST" }).validator((id) => id).handler(deleteTask_createServerFn_handler, async ({ data: id }) => {
	await getAuthOrThrow();
	await prisma.task.delete({ where: { id } });
	return true;
});
var submitTaskProof_createServerFn_handler = createServerRpc({
	id: "0d815090e8cf47634456fae3ba74ed2d4aba1432e6756649a24e60b8e01aeb26",
	name: "submitTaskProof",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => submitTaskProof.__executeServer(opts));
var submitTaskProof = createServerFn({ method: "POST" }).validator((data) => data).handler(submitTaskProof_createServerFn_handler, async ({ data: { taskId, fileBase64, fileName, note } }) => {
	const authResult = await getAuthOrThrow();
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET
	});
	const base64Data = `data:image/jpeg;base64,${fileBase64}`;
	const uploadResult = await cloudinary.uploader.upload(base64Data, {
		folder: `workmonitor/${authResult.userId}/${taskId}`,
		public_id: `${Date.now()}-${fileName}`,
		resource_type: "auto"
	});
	await prisma.taskProof.create({ data: {
		task_id: taskId,
		uploaded_by: authResult.userId,
		image_url: uploadResult.secure_url,
		note
	} });
	await prisma.task.update({
		where: { id: taskId },
		data: {
			status: "completed",
			revision_note: null
		}
	});
	await broadcast("tasks", "task-updates", {
		type: "proof_submitted",
		taskId
	});
	return {
		success: true,
		url: uploadResult.secure_url
	};
});
var fetchTaskComments_createServerFn_handler = createServerRpc({
	id: "01b56f9d44bc30538680091d8927225a12cc5687bfdf8febd6e023480c121ac3",
	name: "fetchTaskComments",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => fetchTaskComments.__executeServer(opts));
var fetchTaskComments = createServerFn({ method: "GET" }).validator((taskId) => taskId).handler(fetchTaskComments_createServerFn_handler, async ({ data: taskId }) => {
	await getAuthOrThrow();
	return await prisma.taskComment.findMany({
		where: { task_id: taskId },
		orderBy: { created_at: "asc" }
	});
});
var addTaskComment_createServerFn_handler = createServerRpc({
	id: "8a5916d0eb783b00333edfc8f83ea803085ebfacd0e0cbdd28574aef9d88b2ad",
	name: "addTaskComment",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => addTaskComment.__executeServer(opts));
var addTaskComment = createServerFn({ method: "POST" }).validator((data) => data).handler(addTaskComment_createServerFn_handler, async ({ data: { taskId, body } }) => {
	const authResult = await getAuthOrThrow();
	const comment = await prisma.taskComment.create({ data: {
		task_id: taskId,
		body,
		author_id: authResult.userId
	} });
	await broadcast("tasks", `comments-${taskId}`, {
		type: "new_comment",
		commentId: comment.id
	});
	return comment;
});
var deleteTaskComment_createServerFn_handler = createServerRpc({
	id: "ba81ae2121290869a0c9d5272316c09999e7674523522d2a2c2a71c54a381d6c",
	name: "deleteTaskComment",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => deleteTaskComment.__executeServer(opts));
var deleteTaskComment = createServerFn({ method: "POST" }).validator((id) => id).handler(deleteTaskComment_createServerFn_handler, async ({ data: id }) => {
	await getAuthOrThrow();
	const comment = await prisma.taskComment.findUnique({ where: { id } });
	if (comment) {
		await prisma.taskComment.delete({ where: { id } });
		await broadcast("tasks", `comments-${comment.task_id}`, {
			type: "delete_comment",
			commentId: id
		});
	}
	return true;
});
var fetchReminders_createServerFn_handler = createServerRpc({
	id: "384e02b0882994cd47370ffe136f8002822e00acd1da2313c06b35261f6e5a75",
	name: "fetchReminders",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => fetchReminders.__executeServer(opts));
var fetchReminders = createServerFn({ method: "GET" }).handler(fetchReminders_createServerFn_handler, async () => {
	const authResult = await getAuthOrThrow();
	return await prisma.reminder.findMany({
		where: { user_id: authResult.userId },
		orderBy: { remind_at: "asc" }
	});
});
var addReminder_createServerFn_handler = createServerRpc({
	id: "3bce7d16c503de62179a0131904bdb00ec076d9de1ce4b64bd66d3d8e563d3a5",
	name: "addReminder",
	filename: "src/lib/tasks.functions.ts"
}, (opts) => addReminder.__executeServer(opts));
var addReminder = createServerFn({ method: "POST" }).validator((data) => data).handler(addReminder_createServerFn_handler, async ({ data: { title, remindAt } }) => {
	const authResult = await getAuthOrThrow();
	return await prisma.reminder.create({ data: {
		title,
		remind_at: new Date(remindAt),
		user_id: authResult.userId
	} });
});
//#endregion
export { addReminder_createServerFn_handler, addSubtask_createServerFn_handler, addTaskComment_createServerFn_handler, bulkApproveTasks_createServerFn_handler, bulkDeleteTasks_createServerFn_handler, bulkReassignTasks_createServerFn_handler, createTask_createServerFn_handler, deleteSubtask_createServerFn_handler, deleteTaskComment_createServerFn_handler, deleteTask_createServerFn_handler, fetchProofsForTask_createServerFn_handler, fetchReminders_createServerFn_handler, fetchSubtasks_createServerFn_handler, fetchTaskComments_createServerFn_handler, fetchTasksForAdmin_createServerFn_handler, fetchTasksForUser_createServerFn_handler, fetchTeam_createServerFn_handler, renameSubtask_createServerFn_handler, submitTaskProof_createServerFn_handler, toggleSubtask_createServerFn_handler, updateSubtask_createServerFn_handler, updateTask_createServerFn_handler };
