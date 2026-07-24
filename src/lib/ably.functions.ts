import { createServerFn } from "@tanstack/react-start";
import { getAuth } from "@clerk/tanstack-start/server";
import { getRequest } from "@tanstack/react-start/server";

// Lazy-init the Ably REST client so it only runs on the server
let _ablyRest: any = null;
function getAblyRest() {
  if (_ablyRest) return _ablyRest;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Ably = require("ably");
  _ablyRest = new Ably.Rest({ key: process.env.ABLY_API_KEY });
  return _ablyRest;
}

export const getAblyToken = createServerFn({ method: "POST" }).handler(async () => {
  const req = getRequest();
  if (!req) throw new Error("No request found");

  const auth = await getAuth(req);
  if (!auth.userId) throw new Error("Unauthorized");

  try {
    const tokenRequestData = await getAblyRest().auth.createTokenRequest({
      clientId: auth.userId,
    });
    return tokenRequestData;
  } catch (e: any) {
    console.error("Failed to generate Ably token:", e);
    throw new Error("Failed to generate real-time token");
  }
});

// Helper function to broadcast messages from other server functions
export async function broadcast(channelName: string, eventName: string, data: any) {
  if (!process.env.ABLY_API_KEY) {
    console.warn("ABLY_API_KEY not set. Skipping broadcast:", channelName, eventName);
    return;
  }
  try {
    const channel = getAblyRest().channels.get(channelName);
    await channel.publish(eventName, data);
  } catch (e) {
    console.error("Ably broadcast error:", e);
  }
}
