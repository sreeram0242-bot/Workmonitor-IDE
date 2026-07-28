import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

declare global {
  interface Window {
    OneSignalDeferred?: any[];
    OneSignal?: any;
    median?: any;
  }
}

export function OneSignalInit() {
  const { user } = useAuth();
  const appId =
    import.meta.env.VITE_ONESIGNAL_APP_ID || "9b51dcef-52d3-4ca4-acc1-93615eb8466a";

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal: any) => {
      try {
        await OneSignal.init({
          appId: appId,
          allowLocalhostAsSecureOrigin: true,
          serviceWorkerPath: "/OneSignalSDKWorker.js",
          serviceWorkerParam: { scope: "/" },
          notifyButton: {
            enable: true,
          },
        });

        // Prompt for web notification permission on PC/browser
        if (
          OneSignal.Notifications &&
          typeof OneSignal.Notifications.requestPermission === "function"
        ) {
          await OneSignal.Notifications.requestPermission();
        }
        if (OneSignal.Slidedown && typeof OneSignal.Slidedown.promptPush === "function") {
          await OneSignal.Slidedown.promptPush();
        }
      } catch (err) {
        console.error("OneSignal init error:", err);
      }
    });
  }, [appId]);

  useEffect(() => {
    if (typeof window === "undefined" || !user?.id) return;

    // Standard Web / PWA Push registration
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal: any) => {
      try {
        if (typeof OneSignal.login === "function") {
          await OneSignal.login(user.id);
        }
        // Prompt for notification permissions if not granted
        if (typeof OneSignal.Notifications?.requestPermission === "function") {
          await OneSignal.Notifications.requestPermission();
        }
      } catch (err) {
        console.error("OneSignal login error:", err);
      }
    });

    // Median (GoNative) App Wrapper Push registration if running as native mobile app
    const g = (window as any).gonative || (window as any).median;
    const os = g?.oneSignal || g?.onesignal;
    if (os) {
      try {
        if (typeof os.register === "function") {
          os.register({ userId: user.id });
        }
        if (os.user && typeof os.user.setExternalUserId === "function") {
          os.user.setExternalUserId({ externalId: user.id });
        }
        if (os.tags && typeof os.tags.setTags === "function") {
          os.tags.setTags({ user_id: user.id });
        }
      } catch (err) {
        console.error("Median OneSignal registration error:", err);
      }
    }
  }, [user?.id]);

  return null;
}
