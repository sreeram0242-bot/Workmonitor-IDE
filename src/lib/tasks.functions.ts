import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "@clerk/tanstack-start/server";
import { PrismaClient } from "@prisma/client";

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

export const fetchTeam = createServerFn({ method: "GET" }).handler(async () => {
  const auth = await getAuthOrThrow(getReqOrThrow());
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
  const auth = await getAuthOrThrow(getReqOrThrow());
  const tasks = await prisma.task.findMany({ orderBy: { created_at: "desc" } });
  return tasks;
});

export const fetchTasksForUser = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    const tasks = await prisma.task.findMany({
      where: { assigned_to: userId },
      orderBy: { created_at: "desc" },
    });
    return tasks;
  });

export const fetchProofsForTask = createServerFn({ method: "GET" })
  .validator((taskId: string) => taskId)
  .handler(async ({ data: taskId }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    const proofs = await prisma.taskProof.findMany({
      where: { task_id: taskId },
      orderBy: { created_at: "desc" },
    });
    return proofs;
  });

export const fetchSubtasks = createServerFn({ method: "GET" })
  .validator((taskId: string) => taskId)
  .handler(async ({ data: taskId }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    const subtasks = await prisma.subtask.findMany({
      where: { task_id: taskId },
      orderBy: [{ position: "asc" }, { created_at: "asc" }],
    });
    return subtasks;
  });

export const addSubtask = createServerFn({ method: "POST" })
  .validator((data: { taskId: string; title: string; position: number }) => data)
  .handler(async ({ data: { taskId, title, position } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    return await prisma.subtask.create({ data: { task_id: taskId, title, position } });
  });

export const toggleSubtask = createServerFn({ method: "POST" })
  .validator((data: { id: string; isDone: boolean }) => data)
  .handler(async ({ data: { id, isDone } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.subtask.update({ where: { id }, data: { is_done: isDone } });
    return true;
  });

export const renameSubtask = createServerFn({ method: "POST" })
  .validator((data: { id: string; title: string }) => data)
  .handler(async ({ data: { id, title } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.subtask.update({ where: { id }, data: { title } });
    return true;
  });

export const deleteSubtask = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.subtask.delete({ where: { id } });
    return true;
  });

export const bulkApproveTasks = createServerFn({ method: "POST" })
  .validator((ids: string[]) => ids)
  .handler(async ({ data: ids }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.task.updateMany({
      where: { id: { in: ids } },
      data: { status: "approved", revision_note: null },
    });
    return true;
  });

export const bulkDeleteTasks = createServerFn({ method: "POST" })
  .validator((ids: string[]) => ids)
  .handler(async ({ data: ids }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.task.deleteMany({
      where: { id: { in: ids } },
    });
    return true;
  });

export const bulkReassignTasks = createServerFn({ method: "POST" })
  .validator((data: { ids: string[]; to: string }) => data)
  .handler(async ({ data: { ids, to } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.task.updateMany({
      where: { id: { in: ids } },
      data: { assigned_to: to },
    });
    return true;
  });

export const createTask = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    return await prisma.task.create({ data });
  });

export const updateTask = createServerFn({ method: "POST" })
  .validator((data: { id: string; updates: any }) => data)
  .handler(async ({ data: { id, updates } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.task.update({ where: { id }, data: updates });
    return true;
  });

export const deleteTask = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.task.delete({ where: { id } });
    return true;
  });

import { put } from "@vercel/blob";

export const submitTaskProof = createServerFn({ method: "POST" })
  .validator(
    (data: { taskId: string; fileBase64: string; fileName: string; note: string | null }) => data,
  )
  .handler(async ({ data: { taskId, fileBase64, fileName, note } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());

    // Upload to Vercel Blob
    const buffer = Buffer.from(fileBase64, "base64");
    const path = `${auth.userId}/${taskId}/${Date.now()}-${fileName}`;

    const blob = await put(path, buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN, // Make sure we use the token
    });

    // Save proof to database
    await prisma.taskProof.create({
      data: {
        task_id: taskId,
        uploaded_by: auth.userId,
        image_url: blob.url,
        note: note,
      },
    });

    // Update task status
    await prisma.task.update({
      where: { id: taskId },
      data: { status: "completed", revision_note: null },
    });

    return { success: true, url: blob.url };
  });

export const fetchTaskComments = createServerFn({ method: "GET" })
  .validator((taskId: string) => taskId)
  .handler(async ({ data: taskId }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    return await prisma.taskComment.findMany({
      where: { task_id: taskId },
      orderBy: { created_at: "asc" },
    });
  });

export const addTaskComment = createServerFn({ method: "POST" })
  .validator((data: { taskId: string; body: string }) => data)
  .handler(async ({ data: { taskId, body } }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    return await prisma.taskComment.create({
      data: { task_id: taskId, body, author_id: auth.userId },
    });
  });

export const deleteTaskComment = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.taskComment.delete({ where: { id } });
    return true;
  });
