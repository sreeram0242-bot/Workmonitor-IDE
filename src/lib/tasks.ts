import { supabase } from "@/integrations/supabase/client";

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
  deadline: string | null;
  revision_note: string | null;
  recurrence: TaskRecurrence;
  tags: string[];
  created_at: string;
  updated_at: string;
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
  const [{ data: profiles }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, position, avatar_url, badge" as any),
    supabase.from("user_roles").select("user_id, role"),
  ]);
  const roleMap = new Map((roles ?? []).map((r) => [r.user_id, r.role]));
  const data = ((profiles as any[]) ?? []).map((p) => ({
    id: p.id,
    full_name: p.full_name,
    position: p.position,
    avatar_url: p.avatar_url,
    badge: p.badge ?? null,
    role: (roleMap.get(p.id) ?? "user") as "admin" | "user",
  }));
  _teamCache = { at: Date.now(), data };
  return data;
}


let _adminTasksCache: TaskRow[] | null = null;
const _userTasksCache = new Map<string, TaskRow[]>();

export function getCachedAdminTasks(): TaskRow[] | null { return _adminTasksCache; }
export function getCachedUserTasks(userId: string): TaskRow[] | null {
  return _userTasksCache.get(userId) ?? null;
}

export async function fetchTasksForAdmin(): Promise<TaskRow[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as TaskRow[];
  _adminTasksCache = rows;
  return rows;
}

export async function fetchTasksForUser(userId: string): Promise<TaskRow[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("assigned_to", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as TaskRow[];
  _userTasksCache.set(userId, rows);
  return rows;
}

export function getCachedTeam(): TeamMember[] | null {
  return _teamCache?.data ?? null;
}

export async function fetchProofsForTask(taskId: string) {
  const { data, error } = await supabase
    .from("task_proofs")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function signedProofUrl(path: string): Promise<string | null> {
  const { data } = await supabase.storage.from("task-proofs").createSignedUrl(path, 60 * 30);
  return data?.signedUrl ?? null;
}

export function priorityColor(p: TaskPriority) {
  return p === "high"
    ? "bg-red-500/10 text-red-500 border-red-500/20"
    : p === "medium"
    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
}

export function statusColor(s: TaskStatus) {
  return s === "approved"
    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    : s === "completed"
    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
    : s === "revision"
    ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
    : "bg-muted text-muted-foreground border-border";
}

// ---------- Subtasks ----------

export interface SubtaskRow {
  id: string;
  task_id: string;
  title: string;
  is_done: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export async function fetchSubtasks(taskId: string): Promise<SubtaskRow[]> {
  const { data, error } = await supabase
    .from("subtasks" as any)
    .select("*")
    .eq("task_id", taskId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as unknown) as SubtaskRow[];
}

export async function addSubtask(taskId: string, title: string, position: number): Promise<SubtaskRow> {
  const { data, error } = await supabase
    .from("subtasks" as any)
    .insert({ task_id: taskId, title, position })
    .select("*")
    .single();
  if (error) throw error;
  return (data as unknown) as SubtaskRow;
}

export async function toggleSubtask(id: string, isDone: boolean): Promise<void> {
  const { error } = await supabase.from("subtasks" as any).update({ is_done: isDone }).eq("id", id);
  if (error) throw error;
}

export async function renameSubtask(id: string, title: string): Promise<void> {
  const { error } = await supabase.from("subtasks" as any).update({ title }).eq("id", id);
  if (error) throw error;
}

export async function deleteSubtask(id: string): Promise<void> {
  const { error } = await supabase.from("subtasks" as any).delete().eq("id", id);
  if (error) throw error;
}

