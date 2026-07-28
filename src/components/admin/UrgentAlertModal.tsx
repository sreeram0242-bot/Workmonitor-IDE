import { useState } from "react";
import { BellRing, Siren, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { sendUrgentBroadcastAlert } from "@/lib/notify.functions";

export function UrgentAlertModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("URGENT WORK ALERT");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("/app");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!message.trim()) {
      toast.error("Please enter a message for the urgent alert.");
      return;
    }

    setLoading(true);
    try {
      await sendUrgentBroadcastAlert({
        data: {
          title: title.trim() || "URGENT WORK ALERT",
          message: message.trim(),
          link: link.trim() || "/app",
        },
      });
      toast.success("🚨 Urgent Alert broadcasted to all team devices!", {
        description: "Push notifications sent with high priority alarm.",
      });
      setOpen(false);
      setMessage("");
    } catch (err: any) {
      toast.error("Failed to send alert: " + (err?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Siren className="h-4 w-4 animate-pulse" />
          <span>Urgent Alert</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-rose-500/20 bg-background sm:rounded-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 text-rose-600 dark:text-rose-500">
            <div className="rounded-full bg-rose-500/10 p-2.5">
              <BellRing className="h-6 w-6 animate-bounce" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Broadcast Urgent Work Alert
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Sends a high-priority lockscreen push notification to all team devices.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="alert-title" className="text-xs font-medium">
              Alert Title
            </Label>
            <Input
              id="alert-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. URGENT SERVER NOTICE"
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="alert-message" className="text-xs font-medium">
              Message Content <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="alert-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter details of the urgent announcement or task..."
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="alert-link" className="text-xs font-medium">
              Action Link (optional)
            </Label>
            <Input
              id="alert-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/app"
              className="h-9 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700 text-white gap-2 font-medium"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>Send Alarm Push</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
