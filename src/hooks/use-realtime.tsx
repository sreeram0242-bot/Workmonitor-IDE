import { useEffect, useState } from "react";
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
            callback(null, token);
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

export function useRealtimeSubscription(channelName: string, eventName: string, onMessage: (data: any) => void) {
  const client = useRealtimeClient();

  useEffect(() => {
    if (!client) return;
    const channel = client.channels.get(channelName);
    
    const listener = (msg: Ably.Message) => {
      onMessage(msg.data);
    };
    
    channel.subscribe(eventName, listener);
    return () => {
      channel.unsubscribe(eventName, listener);
    };
  }, [client, channelName, eventName, onMessage]);
}
