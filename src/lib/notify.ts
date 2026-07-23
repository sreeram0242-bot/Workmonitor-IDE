import { supabase } from "@/integrations/supabase/client";

type NotifyType = "task" | "message" | "mention" | "team" | string;
export interface NotifyPayload {
  user_id: string;
  type: NotifyType;
  message: string;
  link?: string | null;
}

/**
 * Insert notifications, filtering out recipients who have opted out of the
 * relevant category via their profile preferences. @mentions always deliver.
 */
export async function sendNotifications(items: NotifyPayload[]) {
  if (items.length === 0) return;
  const ids = Array.from(new Set(items.map((i) => i.user_id)));
  const { data: prefs } = await supabase
    .from("profiles")
    .select("id, notify_tasks, notify_messages")
    .in("id", ids);
  const prefMap = new Map<string, { notify_tasks: boolean; notify_messages: boolean }>(
    (prefs ?? []).map((p: any) => [p.id, { notify_tasks: p.notify_tasks !== false, notify_messages: p.notify_messages !== false }]),
  );
  const filtered = items.filter((it) => {
    if (it.type === "mention") return true;
    const p = prefMap.get(it.user_id);
    if (!p) return true;
    if (it.type === "message") return p.notify_messages;
    if (it.type === "task" || it.type.startsWith("task_")) return p.notify_tasks;
    return true;
  });
  if (filtered.length === 0) return;
  await supabase.from("notifications").insert(filtered as any);
}
