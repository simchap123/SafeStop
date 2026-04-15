const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
  priority?: "default" | "normal" | "high";
}

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const message: PushMessage = {
      to: token,
      title,
      body,
      data,
      sound: "default",
      priority: "high",
    };

    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();

    if (result.data?.status === "error") {
      return { success: false, error: result.data.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Push notification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendBatchPushNotifications(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  const messages = tokens.map((token) => ({
    to: token,
    title,
    body,
    data,
    sound: "default" as const,
    priority: "high" as const,
  }));

  const batches: PushMessage[][] = [];
  for (let i = 0; i < messages.length; i += 100) {
    batches.push(messages.slice(i, i + 100));
  }

  for (const batch of batches) {
    try {
      await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(batch),
      });
    } catch (error) {
      console.error("Batch push notification error:", error);
    }
  }
}
