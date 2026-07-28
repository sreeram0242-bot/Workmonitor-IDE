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
          serviceWorkerPath: "OneSignalSDKWorker.js",
          serviceWorkerParam: { scope: "/" },
          notifyButton: {
            enable: false,
          },
        });

        // Prompt for notification permission on initial load if supported
        if (
          OneSignal.Notifications &&
          typeof OneSignal.Notifications.requestPermission === "function" &&
          OneSignal.Notifications.permission !== true
        ) {
          await OneSignal.Notifications.requestPermission();
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
    if (window.median && window.median.oneSignal) {
      try {
        window.median.oneSignal.register({ userId: user.id });
      } catch (err) {
        console.error("Median OneSignal registration error:", err);
      }
    }
  }, [user?.id]);

  return null;
}
