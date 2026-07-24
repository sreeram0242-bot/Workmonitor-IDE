import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import * as Ably from "ably";

// Singleton REST client
export const ablyRest = new Ably.Rest({
  key: process.env.ABLY_API_KEY || "",
});

export const getAblyToken = createServerFn({ method: "POST" }).handler(async () => {
  const authResult = await auth();
  if (!authResult.userId) throw new Error("Unauthorized");

  try {
    const tokenRequestData = await ablyRest.auth.createTokenRequest({
      clientId: authResult.userId,
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
    const channel = ablyRest.channels.get(channelName);
    await channel.publish(eventName, data);
  } catch (e) {
    console.error("Ably broadcast error:", e);
  }
}
