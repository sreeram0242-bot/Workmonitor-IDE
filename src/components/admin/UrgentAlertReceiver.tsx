import { useState, useRef } from "react";
import { Siren, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useRealtimeSubscription } from "@/hooks/use-realtime";
import { Link } from "@tanstack/react-router";

export function UrgentAlertReceiver() {
  const { user } = useAuth();
  const [activeAlert, setActiveAlert] = useState<{
    title: string;
    message: string;
    link?: string;
  } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const vibrateIntervalRef = useRef<any>(null);

  const handleClose = () => {
    setActiveAlert(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (vibrateIntervalRef.current) {
      clearInterval(vibrateIntervalRef.current);
      vibrateIntervalRef.current = null;
    }
  };

  useRealtimeSubscription("notifications", "all-users", (msg: any) => {
    const payload = msg?.data ?? msg;
    if (payload?.type === "urgent_alert" || payload?.title || payload?.message) {
      setActiveAlert({
        title: payload.title || "URGENT WORK ALERT",
        message: payload.message || "",
        link: payload.link || "/app",
      });

      // Play continuous looping siren/alarm sound until user clicks close
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        }
        audioRef.current.loop = true;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      } catch (e) {}

      // Trigger repeating device vibration pattern until closed
      try {
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          if (vibrateIntervalRef.current) clearInterval(vibrateIntervalRef.current);
          navigator.vibrate([500, 200, 500, 200, 500, 200, 1000]);
          vibrateIntervalRef.current = setInterval(() => {
            navigator.vibrate([500, 200, 500, 200, 500, 200, 1000]);
          }, 3500);
        }
      } catch (e) {}
    }
  });

  if (!activeAlert) return null;

  return (
    <Dialog open={!!activeAlert} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md border-2 border-rose-500 bg-rose-950/95 text-rose-50 backdrop-blur-md sm:rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400">
              <Siren className="h-6 w-6 animate-pulse text-rose-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                High Priority Announcement
              </span>
            </div>
            {/* Prominent Close X Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 rounded-full text-rose-200 hover:bg-rose-900/60 hover:text-white"
              aria-label="Close message"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <DialogTitle className="text-xl font-extrabold text-white tracking-tight">
            🚨 {activeAlert.title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 text-sm leading-relaxed text-rose-100/90 whitespace-pre-wrap">
          {activeAlert.message}
        </div>

        <div className="mt-4 flex items-center justify-end gap-3 pt-2 border-t border-rose-800/60">
          {activeAlert.link && (
            <Link
              to={activeAlert.link as any}
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-300 hover:text-white underline underline-offset-4"
            >
              <span>View details</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}

          {/* Big Prominent Close Button */}
          <Button
            type="button"
            onClick={handleClose}
            className="bg-white text-rose-950 hover:bg-rose-100 font-bold px-5 h-9 rounded-lg gap-2 shadow-lg"
          >
            <X className="h-4 w-4" />
            <span>Close Message</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
