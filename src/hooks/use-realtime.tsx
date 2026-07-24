import { useEffect, useRef, useState } from "react";
import * as Ably from "ably";
import { getAblyToken } from "@/lib/ably.functions";
import { useAuth } from "@/hooks/use-auth";

let globalAblyClient: Ably.Realtime | null = null;

export function useRealtimeClient() {
  const { user } = useAuth();
  const [client, setClient] = useState<Ably.Realtime | null>(globalAblyClient);

  useEffect(() => {
    if (!user) {
      if (globalAblyClient) {
        globalAblyClient.close();
        globalAblyClient = null;
        setClient(null);
      }
      return;
    }

    if (!globalAblyClient) {
      globalAblyClient = new Ably.Realtime({
        authCallback: async (tokenParams, callback) => {
          try {
            const token = await getAblyToken();
            callback(null, token as any);
          } catch (e: any) {
            callback(e, null);
          }
        },
      });
      setClient(globalAblyClient);
    }
  }, [user]);

  return client;
}

export function useRealtimeSubscription(
  channelName: string,
  eventName: string,
  onMessage: (data: any) => void,
) {
  const client = useRealtimeClient();
  // Use a ref so changing the callback doesn't trigger re-subscription
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    if (!client || !channelName || !eventName) return;
    const channel = client.channels.get(channelName);

    const listener = (msg: Ably.Message) => {
      onMessageRef.current(msg.data);
    };

    channel.subscribe(eventName, listener);
    return () => {
      channel.unsubscribe(eventName, listener);
    };
    // Only re-subscribe when client/channel/event changes — not the callback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, channelName, eventName]);
}
