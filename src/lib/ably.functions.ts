import { createServerFn } from "@tanstack/react-start";
import { getAuth } from "@clerk/tanstack-start/server";
import { getRequest } from "@tanstack/react-start/server";
import Ably from "ably";

// We keep a server-side Ably instance to generate tokens
// Note: In production, ABLY_API_KEY must be set in your environment
const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY || "dummy_key" });

export const getAblyToken = createServerFn({ method: "POST" })
  .handler(async () => {
    const req = getRequest();
    if (!req) throw new Error("No request found");

    const auth = await getAuth(req);
    // Even if unauthenticated, we can provide a token if we want guest access,
    // but for our app we restrict to logged-in users.
    if (!auth.userId) throw new Error("Unauthorized");

    // Generate a token request scoped to this user
    try {
      const tokenRequestData = await ably.auth.createTokenRequest({
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
    const channel = ably.channels.get(channelName);
    await channel.publish(eventName, data);
  } catch (e) {
    console.error("Ably broadcast error:", e);
  }
}
