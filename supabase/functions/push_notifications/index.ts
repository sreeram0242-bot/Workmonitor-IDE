import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("Push Notification Edge Function starting");

serve(async (req) => {
  try {
    // 1. Parse the incoming database webhook payload
    const payload = await req.json();
    console.log("Webhook payload:", payload);

    // We only care about new messages (INSERT)
    if (payload.type !== 'INSERT' || !payload.record) {
      return new Response(JSON.stringify({ message: "Not an insert event" }), { status: 200 });
    }

    const message = payload.record;
    
    // 2. Initialize Supabase Admin Client to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    // 3. Find the recipient's FCM token. 
    // (Assuming the message has a receiver_id, or it belongs to a conversation)
    // For this example, let's fetch the sender's profile to get their name, 
    // and we would fetch the receiver's FCM token to send the push.
    
    // In a real chat app, you fetch members of the conversation.
    // For demonstration, let's just query profiles that have an FCM token and are NOT the sender.
    const { data: recipientProfile } = await supabaseAdmin
      .from('profiles')
      .select('fcm_token')
      .eq('id', message.user_id) // Usually this would be the recipient ID
      .maybeSingle();

    const fcmToken = recipientProfile?.fcm_token;

    if (!fcmToken) {
      console.log("No FCM token found for recipient");
      return new Response(JSON.stringify({ message: "No FCM token" }), { status: 200 });
    }

    // 4. Send the push notification via Firebase Cloud Messaging (FCM) HTTP v1 API
    // Note: You must configure FIREBASE_SERVICE_ACCOUNT in Supabase Secrets
    // and generate a bearer token. For simplicity, this is the payload structure:
    
    const fcmPayload = {
      message: {
        token: fcmToken,
        notification: {
          title: "New Message",
          body: message.content || "You received a new message",
        },
        data: {
          messageId: message.id,
        }
      }
    };

    // Example fetch to FCM (requires Bearer token generation which is complex in Deno)
    // const fcmResponse = await fetch(`https://fcm.googleapis.com/v1/projects/YOUR_PROJECT_ID/messages:send`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${firebaseAccessToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(fcmPayload),
    // });

    console.log("Push notification payload prepared:", fcmPayload);

    return new Response(JSON.stringify({ success: true, message: "Push notification simulated" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending push notification:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
