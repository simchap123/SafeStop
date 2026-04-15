type SSEEvent =
  | "session_started"
  | "stop_detected"
  | "confirmation_received"
  | "alert_triggered"
  | "session_ended";

interface SSEClient {
  id: string;
  userId: string;
  controller: ReadableStreamDefaultController;
}

class SSEManager {
  private clients: Map<string, SSEClient> = new Map();

  addClient(userId: string, controller: ReadableStreamDefaultController): string {
    const id = crypto.randomUUID();
    this.clients.set(id, { id, userId, controller });
    return id;
  }

  removeClient(id: string) {
    this.clients.delete(id);
  }

  sendToUser(userId: string, event: SSEEvent, data: Record<string, unknown>) {
    const encoder = new TextEncoder();
    const message = `event: ${event}
data: ${JSON.stringify(data)}

`;

    for (const client of this.clients.values()) {
      if (client.userId === userId) {
        try {
          client.controller.enqueue(encoder.encode(message));
        } catch {
          this.clients.delete(client.id);
        }
      }
    }
  }

  broadcast(event: SSEEvent, data: Record<string, unknown>) {
    const encoder = new TextEncoder();
    const message = `event: ${event}
data: ${JSON.stringify(data)}

`;

    for (const client of this.clients.values()) {
      try {
        client.controller.enqueue(encoder.encode(message));
      } catch {
        this.clients.delete(client.id);
      }
    }
  }
}

export const sseManager = new SSEManager();
export type { SSEEvent };
