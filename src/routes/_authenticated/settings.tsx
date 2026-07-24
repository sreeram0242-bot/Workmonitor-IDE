import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Switch } from "@/components/ui/switch";
import { UserProfile, useClerk } from "@clerk/tanstack-start";
import {
  updateProfile,
  checkPasscode,
  verifyPasscode,
  updatePasscode,
} from "@/lib/settings.functions";
import { put } from "@vercel/blob";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings · C-Enterprises WorkMonitor" },
      { name: "description", content: "Manage your profile photo and account preferences." },
    ],
  }),
});

function SettingsPage() {
  const { user, profile, role } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const initials = (profile?.full_name || user?.email || "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `avatars/${user.id}-${Date.now()}.${ext}`;

      // We will upload to Vercel Blob using the SDK
      // The API route for this needs to be set up, but for now we'll do it on the client
      // actually Vercel Blob requires a server token, so we shouldn't do it directly on the client without a token.
      // Clerk handles avatars out of the box! We don't even need to upload to Vercel Blob.
      // But just to keep the old UI working, I'll show a toast.
      toast.info("Avatar changes should be done via Clerk Account settings below.");
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Update your profile photo. Other details are managed by admins.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)] text-2xl font-semibold text-white shadow-lg ring-4 ring-white">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[oklch(0.28_0.09_265)] text-white shadow-md ring-2 ring-white transition hover:scale-105 disabled:opacity-60"
                aria-label="Change photo"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
              <Button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                variant="outline"
              >
                {uploading ? "Uploading…" : "Change photo"}
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF · Max 5 MB</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input value={profile?.full_name ?? ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Position</Label>
              <Input value={profile?.position ?? ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Badge</Label>
              <Input value={(profile as any)?.badge ?? "—"} disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input value={role ?? ""} disabled className="capitalize" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Email</Label>
              <Input value={user?.email ?? ""} disabled />
            </div>
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Name, position, and badge can only be changed by an admin.
            </p>
          </div>
        </CardContent>
      </Card>

      <PreferencesCard />
      <PasscodeCard />

      <div className="mt-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight mb-4">
          Account Security
        </h2>
        <UserProfile routing="hash" />
      </div>
    </div>
  );
}

function PreferencesCard() {
  const { user, profile } = useAuth();
  const [notifyTasks, setNotifyTasks] = useState<boolean>((profile as any)?.notify_tasks ?? true);
  const [notifyMessages, setNotifyMessages] = useState<boolean>(
    (profile as any)?.notify_messages ?? true,
  );
  const [presenceHidden, setPresenceHidden] = useState<boolean>(
    (profile as any)?.presence_hidden ?? false,
  );
  const [saving, setSaving] = useState<string | null>(null);

  async function update(key: string, value: boolean, setter: (v: boolean) => void) {
    if (!user) return;
    const prev = value;
    setter(value);
    setSaving(key);

    try {
      await updateProfile({ data: { [key]: value } });
      toast.success("Preference saved");
    } catch (error: any) {
      setter(!prev);
      toast.error(error.message);
    } finally {
      setSaving(null);
    }
  }

  const Row = ({ icon: Icon, title, desc, checked, onChange, k }: any) => (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-card/50 p-4">
      <div className="flex gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={(v) => onChange(v)} disabled={saving === k} />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4" /> Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Row
          icon={Bell}
          k="notify_tasks"
          title="Task notifications"
          desc="New assignments, approvals, revisions, and comments."
          checked={notifyTasks}
          onChange={(v: boolean) => update("notify_tasks", v, setNotifyTasks)}
        />
        <Row
          icon={Bell}
          k="notify_messages"
          title="Chat notifications"
          desc="New direct and group messages."
          checked={notifyMessages}
          onChange={(v: boolean) => update("notify_messages", v, setNotifyMessages)}
        />
        <Row
          icon={Eye}
          k="presence_hidden"
          title="Hide my online status"
          desc="Teammates won't see when you're active."
          checked={presenceHidden}
          onChange={(v: boolean) => update("presence_hidden", v, setPresenceHidden)}
        />
      </CardContent>
    </Card>
  );
}

// Removed Session and Password cards in favor of Clerk

function PasscodeCard() {
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkPasscode().then(setHasPin);
  }, []);

  async function save() {
    if (!/^\d{4}$/.test(next)) {
      toast.error("Passcode must be 4 digits");
      return;
    }
    if (next !== confirm) {
      toast.error("Passcodes don't match");
      return;
    }
    setSaving(true);
    try {
      if (hasPin) {
        const ok = await verifyPasscode({ data: current });
        if (!ok) {
          toast.error("Current passcode is incorrect");
          setSaving(false);
          return;
        }
      }
      await updatePasscode({ data: next });
      toast.success(hasPin ? "Passcode updated" : "Passcode set");
      setCurrent("");
      setNext("");
      setConfirm("");
      setHasPin(true);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save passcode");
    } finally {
      setSaving(false);
    }
  }

  const pinInput = (val: string, set: (s: string) => void, id: string, label: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={val}
        onChange={(e) => set(e.target.value.replace(/\D/g, "").slice(0, 4))}
        inputMode="numeric"
        maxLength={4}
        placeholder="••••"
        className="tracking-[0.5em] text-center text-lg font-semibold"
      />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-4 w-4" /> App Passcode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          A 4-digit passcode is required every time you sign in.
          {hasPin === false && " You haven't set one yet."}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {hasPin && pinInput(current, setCurrent, "cur-pin", "Current passcode")}
          {pinInput(next, setNext, "new-pin", hasPin ? "New passcode" : "Passcode")}
          {pinInput(confirm, setConfirm, "conf-pin", "Confirm")}
        </div>
        <Button onClick={save} disabled={saving || hasPin === null}>
          {saving ? "Saving…" : hasPin ? "Update passcode" : "Set passcode"}
        </Button>
      </CardContent>
    </Card>
  );
}
