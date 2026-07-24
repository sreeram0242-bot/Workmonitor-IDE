import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Pencil, KeyRound } from "lucide-react";
import { PersonIcon } from "@/components/brand/PersonIcon";
import { BadgePill } from "@/components/brand/BadgePill";
import { fetchTeam, getCachedTeam, type TeamMember } from "@/lib/tasks";
import { createTeamMember, deleteTeamMember, resetUserPasscode } from "@/lib/admin.functions";
import { setMemberBadge } from "@/lib/badges.functions";
import { useAuth } from "@/hooks/use-auth";

import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/team")({
  head: () => ({
    meta: [
      { title: "Team Management — C-Enterprises WorkMonitor" },
      {
        name: "description",
        content: "Create employee accounts, manage team members, positions, and portal roles.",
      },
      { property: "og:title", content: "Team Management — C-Enterprises WorkMonitor" },
      {
        property: "og:description",
        content: "Manage the C-Enterprises WorkMonitor team directory and roles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const { user, role } = useAuth();
  const [team, setTeam] = useState<TeamMember[]>(() => getCachedTeam() ?? []);
  const [open, setOpen] = useState(false);
  const createFn = useServerFn(createTeamMember);
  const deleteFn = useServerFn(deleteTeamMember);
  const resetFn = useServerFn(resetUserPasscode);
  const badgeFn = useServerFn(setMemberBadge);
  const [editingBadge, setEditingBadge] = useState<TeamMember | null>(null);

  async function reload() {
    setTeam(await fetchTeam(true));
  }
  useEffect(() => {
    reload();
  }, []);

  const isAdmin = role === "admin";

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Team</h1>
          <p className="text-sm text-muted-foreground">
            Create accounts, assign positions and roles.
          </p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add member
              </Button>
            </DialogTrigger>
            <NewMemberDialog
              onCreate={async (input) => {
                try {
                  await createFn({ data: input });
                  await reload();
                  setOpen(false);
                  toast.success(`${input.full_name} added`);
                } catch (e: any) {
                  toast.error(e?.message ?? "Failed to create user");
                }
              }}
            />
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Members ({team.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {team.map((m) => (
            <div
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ${m.role === "admin" ? "bg-brand-accent/10 text-brand-accent" : "bg-muted text-muted-foreground"}`}
                >
                  {m.avatar_url ? (
                    <img
                      src={m.avatar_url}
                      alt={m.full_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <PersonIcon admin={m.role === "admin"} className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{m.full_name}</span>
                    {m.badge && <BadgePill label={m.badge} />}
                  </div>
                  <div className="text-xs text-muted-foreground">{m.position}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={m.role === "admin" ? "border-brand-accent/30 text-brand-accent" : ""}
                >
                  {m.role}
                </Badge>
                {isAdmin && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingBadge(m)}
                    title="Set badge"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {isAdmin && m.id !== user?.id && (
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Reset 4-digit passcode"
                    onClick={async () => {
                      if (
                        !confirm(
                          `Reset ${m.full_name}'s 4-digit passcode? They'll set a new one on their next sign-in.`,
                        )
                      )
                        return;
                      try {
                        await resetFn({ data: { targetUserId: m.id } });
                        toast.success("Passcode reset");
                      } catch (e: any) {
                        toast.error(e?.message ?? "Failed to reset passcode");
                      }
                    }}
                  >
                    <KeyRound className="h-4 w-4 text-amber-600" />
                  </Button>
                )}
                {isAdmin && m.id !== user?.id && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={async () => {
                      if (
                        !confirm(`Delete ${m.full_name}? This removes their account permanently.`)
                      )
                        return;
                      try {
                        await deleteFn({ data: { user_id: m.id } });
                        await reload();
                        toast.success("Member removed");
                      } catch (e: any) {
                        toast.error(e?.message ?? "Failed to delete");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {team.length === 0 && (
            <div className="text-sm text-muted-foreground">No members yet.</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingBadge} onOpenChange={(o) => !o && setEditingBadge(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set badge for {editingBadge?.full_name}</DialogTitle>
          </DialogHeader>
          {editingBadge && (
            <BadgeEditor
              current={editingBadge.badge ?? ""}
              onSave={async (value) => {
                try {
                  await badgeFn({ data: { user_id: editingBadge.id, badge: value || null } });
                  await reload();
                  setEditingBadge(null);
                  toast.success("Badge updated");
                } catch (e: any) {
                  toast.error(e?.message ?? "Failed to update badge");
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

interface NewMemberInput {
  email: string;
  password: string;
  full_name: string;
  position: string;
  role: "admin" | "user";
}

function NewMemberDialog({ onCreate }: { onCreate: (input: NewMemberInput) => Promise<void> }) {
  const [form, setForm] = useState<NewMemberInput>({
    email: "",
    password: "",
    full_name: "",
    position: "",
    role: "user",
  });
  const [busy, setBusy] = useState(false);
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add team member</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label>Full name</Label>
          <Input
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Position</Label>
          <Input
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            placeholder="e.g. Marketing Lead"
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Temporary password</Label>
          <Input
            type="text"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="min 6 chars"
          />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select
            value={form.role}
            onValueChange={(v: "admin" | "user") => setForm({ ...form, role: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin (Founder / CEO / Tech Head)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={busy || !form.email || !form.password || !form.full_name || !form.position}
          onClick={async () => {
            setBusy(true);
            try {
              await onCreate(form);
            } finally {
              setBusy(false);
            }
          }}
        >
          Create account
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function BadgeEditor({
  current,
  onSave,
}: {
  current: string;
  onSave: (value: string) => Promise<void>;
}) {
  const [val, setVal] = useState(current);
  const [busy, setBusy] = useState(false);
  const presets = ["Developer", "Founder", "CEO", "Content", "Designer", "Marketing"];
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Badge label</Label>
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="e.g. Developer"
          maxLength={24}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setVal(p)}
            className="rounded-full border border-border/60 px-3 py-1 text-xs hover:bg-muted"
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setVal("")}
          className="rounded-full border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive/10"
        >
          Remove
        </button>
      </div>
      <DialogFooter>
        <Button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onSave(val.trim());
            } finally {
              setBusy(false);
            }
          }}
        >
          Save badge
        </Button>
      </DialogFooter>
    </div>
  );
}
