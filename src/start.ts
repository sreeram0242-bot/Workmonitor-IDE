import { createStart, createMiddleware } from "@tanstack/react-start";
import { clerkMiddleware } from "@clerk/tanstack-react-start/server";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    const errString = error?.stack || error?.message || String(error) || "Internal Server Error";
    console.error("Server function error:", errString);
    
    // Instead of swallowing into HTML without details, let's include the error!
    return new Response(renderErrorPage(errString), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, clerkMiddleware({ allowedClockSkewInMs: 120000, clockSkewInMs: 120000 } as any)],
}));
