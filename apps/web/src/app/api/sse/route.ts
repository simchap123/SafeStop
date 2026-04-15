import { NextRequest } from "next/server";
import { getSession } from "@/lib/middleware";
import { sseManager } from "@/lib/sse";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection event
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ userId: session.user.id })}\n\n`)
      );

      // Register client
      const clientId = sseManager.addClient(session.user.id, controller);

      // Heartbeat every 30 seconds
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          clearInterval(heartbeat);
          sseManager.removeClient(clientId);
        }
      }, 30000);

      // Cleanup on close
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        sseManager.removeClient(clientId);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
