import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { prisma } from "@/lib/prisma";
import { broadcast } from "@/lib/ably.functions";
import * as cloudinaryModule from "cloudinary";

const cloudinary = cloudinaryModule.v2;

async function getAuthOrThrow() {
  const authResult = await auth();
  if (!authResult.userId) throw new Error("Unauthorized");
  return authResult;
}

export const fetchTeam = createServerFn({ method: "GET" }).handler(async () => {
  const authResult = await getAuthOrThrow();
  const profiles = await prisma.profile.findMany();
  const roles = await prisma.userRole.findMany();
  const roleMap = new Map(roles.map((r) => [r.user_id, r.role]));
  return profiles.map((p) => ({
    id: p.id,
    full_name: p.full_name,
    position: p.position,
    avatar_url: p.avatar_url,
    badge: p.badge,
    role: roleMap.get(p.id) || "user",
  }));
});

export const fetchTasksForAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const authResult = await getAuthOrThrow();
  const tasks = await prisma.task.findMany({ orderBy: { created_at: "desc" } });
  return tasks;
});

export const fetchTasksForUser = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const authResult = await getAuthOrThrow();
    const tasks = await prisma.task.findMany({
      where: { assigned_to: userId },
      orderBy: { created_at: "desc" },
    });
    return tasks;
  });

export const fetchProofsForTask = createServerFn({ method: "GET" })
  .validator((taskId: string) => taskId)
  .handler(async ({ data: taskId }) => {
    const authResult = await getAuthOrThrow();
    const proofs = await prisma.taskProof.findMany({
      where: { task_id: taskId },
      orderBy: { created_at: "desc" },
    });
    return proofs;
  });

export const fetchSubtasks = createServerFn({ method: "GET" })
  .validator((taskId: string) => taskId)
  .handler(async ({ data: taskId }) => {
    const authResult = await getAuthOrThrow();
    const subtasks = await prisma.subtask.findMany({
      where: { task_id: taskId },
      orderBy: [{ position: "asc" }, { created_at: "asc" }],
    });
    return subtasks;
  });

export const addSubtask = createServerFn({ method: "POST" })
  .validator((data: { taskId: string; title: string; position: number }) => data)
  .handler(async ({ data: { taskId, title, position } }) => {
    const authResult = await getAuthOrThrow();
    return await prisma.subtask.create({ data: { task_id: taskId, title, position } });
  });

export const toggleSubtask = createServerFn({ method: "POST" })
  .validator((data: { id: string; isDone: boolean }) => data)
  .handler(async ({ data: { id, isDone } }) => {
    const authResult = await getAuthOrThrow();
    await prisma.subtask.update({ where: { id }, data: { is_done: isDone } });
    return true;
  });

export const renameSubtask = createServerFn({ method: "POST" })
  .validator((data: { id: string; title: string }) => data)
  .handler(async ({ data: { id, title } }) => {
    const authResult = await getAuthOrThrow();
    await prisma.subtask.update({ where: { id }, data: { title } });
    return true;
  });

export const updateSubtask = createServerFn({ method: "POST" })
  .validator((data: { id: string; updates: any }) => data)
  .handler(async ({ data: { id, updates } }) => {
    const authResult = await getAuthOrThrow();
    await prisma.subtask.update({ where: { id }, data: updates });
    return true;
  });

export const deleteSubtask = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const authResult = await getAuthOrThrow();
    await prisma.subtask.delete({ where: { id } });
    return true;
  });

export const bulkApproveTasks = createServerFn({ method: "POST" })
  .validator((ids: string[]) => ids)
  .handler(async ({ data: ids }) => {
    const authResult = await getAuthOrThrow();
    await prisma.task.updateMany({
      where: { id: { in: ids } },
      data: { status: "approved", revision_note: null },
    });
    await broadcast("tasks", "task-updates", { type: "bulk_approve" });
    return true;
  });

export const bulkDeleteTasks = createServerFn({ method: "POST" })
  .validator((ids: string[]) => ids)
  .handler(async ({ data: ids }) => {
    const authResult = await getAuthOrThrow();
    await prisma.task.deleteMany({
      where: { id: { in: ids } },
    });
    return true;
  });

export const bulkReassignTasks = createServerFn({ method: "POST" })
  .validator((data: { ids: string[]; to: string }) => data)
  .handler(async ({ data: { ids, to } }) => {
    const authResult = await getAuthOrThrow();
    await prisma.task.updateMany({
      where: { id: { in: ids } },
      data: { assigned_to: to },
    });
    return true;
  });

export const createTask = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const authResult = await getAuthOrThrow();
    const task = await prisma.task.create({ data });
    await broadcast("tasks", "task-updates", { type: "task_created", taskId: task.id });
    return task;
  });

export const updateTask = createServerFn({ method: "POST" })
  .validator((data: { id: string; updates: any }) => data)
  .handler(async ({ data: { id, updates } }) => {
    const authResult = await getAuthOrThrow();
    await prisma.task.update({ where: { id }, data: updates });
    await broadcast("tasks", "task-updates", { type: "task_updated", taskId: id });
    return true;
  });

export const deleteTask = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const authResult = await getAuthOrThrow();
    await prisma.task.delete({ where: { id } });
    return true;
  });

export const submitTaskProof = createServerFn({ method: "POST" })
  .validator(
    (data: { taskId: string; fileBase64: string; fileName: string; note: string | null }) => data,
  )
  .handler(async ({ data: { taskId, fileBase64, fileName, note } }) => {
    const authResult = await getAuthOrThrow();

    // Configure Cloudinary from environment
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const base64Data = `data:image/jpeg;base64,${fileBase64}`;
    const uploadResult = await cloudinary.uploader.upload(base64Data, {
      folder: `workmonitor/${authResult.userId}/${taskId}`,
      public_id: `${Date.now()}-${fileName}`,
      resource_type: "auto",
    });

    // Save proof to database
    await prisma.taskProof.create({
      data: {
        task_id: taskId,
        uploaded_by: authResult.userId,
        image_url: uploadResult.secure_url,
        note: note,
      },
    });

    // Update task status
    await prisma.task.update({
      where: { id: taskId },
      data: { status: "completed", revision_note: null },
    });

    await broadcast("tasks", "task-updates", { type: "proof_submitted", taskId });

    return { success: true, url: uploadResult.secure_url };
  });

export const fetchTaskComments = createServerFn({ method: "GET" })
  .validator((taskId: string) => taskId)
  .handler(async ({ data: taskId }) => {
    const authResult = await getAuthOrThrow();
    return await prisma.taskComment.findMany({
      where: { task_id: taskId },
      orderBy: { created_at: "asc" },
    });
  });

export const addTaskComment = createServerFn({ method: "POST" })
  .validator((data: { taskId: string; body: string }) => data)
  .handler(async ({ data: { taskId, body } }) => {
    const authResult = await getAuthOrThrow();
    const comment = await prisma.taskComment.create({
      data: { task_id: taskId, body, author_id: authResult.userId },
    });
    await broadcast("tasks", `comments-${taskId}`, { type: "new_comment", commentId: comment.id });
    return comment;
  });

export const deleteTaskComment = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const authResult = await getAuthOrThrow();
    // Fetch the comment first to get task_id for broadcast, then delete
    const comment = await prisma.taskComment.findUnique({ where: { id } });
    if (comment) {
      await prisma.taskComment.delete({ where: { id } });
      await broadcast("tasks", `comments-${comment.task_id}`, { type: "delete_comment", commentId: id });
    }
    return true;
  });

export const fetchReminders = createServerFn({ method: "GET" }).handler(async () => {
  const authResult = await getAuthOrThrow();
  return await prisma.reminder.findMany({
    where: { user_id: authResult.userId },
    orderBy: { remind_at: "asc" },
  });
});

export const addReminder = createServerFn({ method: "POST" })
  .validator((data: { title: string; remindAt: string }) => data)
  .handler(async ({ data: { title, remindAt } }) => {
    const authResult = await getAuthOrThrow();
    return await prisma.reminder.create({
      data: {
        title,
        remind_at: new Date(remindAt),
        user_id: authResult.userId,
      },
    });
  });
