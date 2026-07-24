import {
  fetchTeam as serverFetchTeam,
  fetchTasksForAdmin as serverFetchTasksForAdmin,
  fetchTasksForUser as serverFetchTasksForUser,
  fetchProofsForTask as serverFetchProofsForTask,
  fetchSubtasks as serverFetchSubtasks,
  addSubtask as serverAddSubtask,
  toggleSubtask as serverToggleSubtask,
  renameSubtask as serverRenameSubtask,
  deleteSubtask as serverDeleteSubtask,
  updateSubtask as serverUpdateSubtask,
  bulkApproveTasks as serverBulkApproveTasks,
  bulkDeleteTasks as serverBulkDeleteTasks,
  bulkReassignTasks as serverBulkReassignTasks,
  createTask as serverCreateTask,
  updateTask as serverUpdateTask,
  deleteTask as serverDeleteTask,
  submitTaskProof as serverSubmitTaskProof,
  fetchTaskComments as serverFetchTaskComments,
  addTaskComment as serverAddTaskComment,
  deleteTaskComment as serverDeleteTaskComment,
} from "./tasks.functions";

export type TaskStatus = "pending" | "completed" | "approved" | "revision";
export type TaskPriority = "low" | "medium" | "high";
export type TaskRecurrence = "none" | "daily" | "weekly" | "monthly";

export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  assigned_to: string;
  assigned_by: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string | Date | null;
  revision_note: string | null;
  recurrence: string | null;
  tags: string[];
  created_at: string | Date;
  updated_at: string | Date;
}

export interface TeamMember {
  id: string;
  full_name: string;
  position: string;
  avatar_url: string | null;
  role: "admin" | "user";
  badge: string | null;
}

let _teamCache: { at: number; data: TeamMember[] } | null = null;
const TEAM_TTL_MS = 30_000;

export async function fetchTeam(force = false): Promise<TeamMember[]> {
  if (!force && _teamCache && Date.now() - _teamCache.at < TEAM_TTL_MS) {
    return _teamCache.data;
  }
  const data = await serverFetchTeam();
  _teamCache = { at: Date.now(), data: data as any[] };
  return _teamCache.data;
}

let _adminTasksCache: TaskRow[] | null = null;
const _userTasksCache = new Map<string, TaskRow[]>();

export function getCachedAdminTasks(): TaskRow[] | null {
  return _adminTasksCache;
}
export function getCachedUserTasks(userId: string): TaskRow[] | null {
  return _userTasksCache.get(userId) ?? null;
}

export async function fetchTasksForAdmin(): Promise<TaskRow[]> {
  const rows = await serverFetchTasksForAdmin();
  _adminTasksCache = rows as any[];
  return _adminTasksCache!;
}

export async function fetchTasksForUser(userId: string): Promise<TaskRow[]> {
  const rows = await serverFetchTasksForUser({ data: userId });
  _userTasksCache.set(userId, rows as any[]);
  return rows as any[];
}

export function getCachedTeam(): TeamMember[] | null {
  return _teamCache?.data ?? null;
}

export async function fetchProofsForTask(taskId: string) {
  return await serverFetchProofsForTask({ data: taskId });
}

export async function signedProofUrl(path: string): Promise<string | null> {
  return path;
}

export function priorityColor(p: string) {
  return p === "high"
    ? "bg-red-500/10 text-red-500 border-red-500/20"
    : p === "medium"
      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
}

export function statusColor(s: string) {
  return s === "approved"
    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    : s === "completed"
      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
      : s === "revision"
        ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
        : "bg-muted text-muted-foreground border-border";
}

export interface SubtaskRow {
  id: string;
  task_id: string;
  title: string;
  is_done: boolean;
  position: number;
  created_at: string | Date;
  updated_at: string | Date;
}

export async function fetchSubtasks(taskId: string): Promise<SubtaskRow[]> {
  return (await serverFetchSubtasks({ data: taskId })) as any[];
}

export async function addSubtask(
  taskId: string,
  title: string,
  position: number,
): Promise<SubtaskRow> {
  return (await serverAddSubtask({ data: { taskId, title, position } })) as any;
}

export async function toggleSubtask(id: string, isDone: boolean): Promise<void> {
  await serverToggleSubtask({ data: { id, isDone } });
}

export async function renameSubtask(id: string, title: string): Promise<void> {
  await serverRenameSubtask({ data: { id, title } });
}

export async function deleteSubtask(id: string): Promise<void> {
  await serverDeleteSubtask({ data: id });
}

export async function bulkApproveTasks(ids: string[]) {
  return await serverBulkApproveTasks({ data: ids });
}

export async function bulkDeleteTasks(ids: string[]) {
  return await serverBulkDeleteTasks({ data: ids });
}

export async function bulkReassignTasks(ids: string[], to: string) {
  return await serverBulkReassignTasks({ data: { ids, to } });
}

export async function createTask(data: any) {
  return await serverCreateTask({ data });
}

export async function updateTask(id: string, updates: any) {
  return await serverUpdateTask({ data: { id, updates } });
}

export async function deleteTask(id: string) {
  return await serverDeleteTask({ data: id });
}

export async function submitTaskProof(
  taskId: string,
  fileBase64: string,
  fileName: string,
  note: string | null,
) {
  return await serverSubmitTaskProof({ data: { taskId, fileBase64, fileName, note } });
}

export async function fetchTaskComments(taskId: string) {
  return await serverFetchTaskComments({ data: taskId });
}

export async function addTaskComment(taskId: string, body: string) {
  return await serverAddTaskComment({ data: { taskId, body } });
}

export async function deleteTaskComment(id: string) {
  return await serverDeleteTaskComment({ data: id });
}

// Reminders placeholder
export interface ReminderRow {
  id: string;
  user_id: string;
  title: string;
  remind_at: string | Date;
  notified: boolean;
  created_at: string | Date;
}
export async function fetchReminders(): Promise<ReminderRow[]> {
  return [];
}
export async function addReminder(title: string, remindAt: Date): Promise<ReminderRow | null> {
  return null;
}
