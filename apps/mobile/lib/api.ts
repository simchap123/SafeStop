const API_URL = "https://test.shulgenius.com";

// Session cookie storage
let sessionCookie = "";

export function setSessionCookie(cookie: string) {
  sessionCookie = cookie;
}

export function getSessionCookie() {
  return sessionCookie;
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Origin": API_URL,
    ...(options.headers as Record<string, string> || {}),
  };
  if (sessionCookie) {
    headers["Cookie"] = sessionCookie;
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: "include" });
  // Capture session cookies from responses
  const setCookie = res.headers.get("set-cookie");
  if (setCookie && setCookie.includes("better-auth.session_token=")) {
    const cookiePart = setCookie.split(";")[0];
    sessionCookie = cookiePart;
    // Also persist to storage
    try {
      const { storage } = await import("./storage");
      await storage.setItem("safestop:session-cookie", cookiePart);
    } catch {}
  }
  return res;
}

// Auth
export async function signUp(email: string, password: string, name: string) {
  const res = await apiFetch("/api/auth/sign-up/email", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Signup failed" }));
    throw new Error(err.message || "Signup failed");
  }
  return res.json();
}

export async function signIn(email: string, password: string) {
  const res = await apiFetch("/api/auth/sign-in/email", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Invalid credentials" }));
    throw new Error(err.message || "Invalid credentials");
  }
  return res.json();
}

export async function signOut() {
  await apiFetch("/api/auth/sign-out", { method: "POST" }).catch(() => {});
  sessionCookie = "";
  try {
    const { storage } = await import("./storage");
    await storage.removeItem("safestop:session-cookie");
  } catch {}
}

// Families
export async function getFamily() {
  const res = await apiFetch("/api/families");
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) return null;
  return res.json();
}

export async function createFamily(name: string) {
  const res = await apiFetch("/api/families", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create family");
  return res.json();
}

export async function joinFamily(inviteCode: string) {
  const res = await apiFetch("/api/families/join", {
    method: "POST",
    body: JSON.stringify({ inviteCode }),
  });
  if (!res.ok) throw new Error("Failed to join family");
  return res.json();
}

// Children
export async function getChildren(familyId: string) {
  const res = await apiFetch(`/api/children?familyId=${familyId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function createChild(data: { name: string; age?: number; familyId: string }) {
  const res = await apiFetch("/api/children", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add child");
  return res.json();
}

export async function updateChild(id: string, data: { name?: string; age?: number }) {
  const res = await apiFetch(`/api/children/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update child");
  return res.json();
}

export async function deleteChild(id: string) {
  const res = await apiFetch(`/api/children/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete child");
}

// Destinations
export async function getDestinations(familyId: string) {
  const res = await apiFetch(`/api/destinations?familyId=${familyId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function createDestination(data: { name: string; address?: string; familyId: string; latitude?: string; longitude?: string }) {
  const res = await apiFetch("/api/destinations", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add destination");
  return res.json();
}

// Sessions
export async function createSession(data: { familyId: string; childIds: string[]; destinationId?: string }) {
  const res = await apiFetch("/api/sessions", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
}

export async function getSessions(familyId: string) {
  const res = await apiFetch(`/api/sessions?familyId=${familyId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function updateSession(id: string, data: { status?: string }) {
  const res = await apiFetch(`/api/sessions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update session");
  return res.json();
}

// Alerts
export async function getAlerts() {
  const res = await apiFetch("/api/alerts");
  if (!res.ok) return [];
  return res.json();
}

export async function resolveAlert(id: string, note: string) {
  const res = await apiFetch(`/api/alerts/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify({ resolutionNote: note }),
  });
  if (!res.ok) throw new Error("Failed to resolve alert");
  return res.json();
}

// Notifications
export async function getNotifications() {
  const res = await apiFetch("/api/notifications");
  if (!res.ok) return [];
  return res.json();
}

// Push tokens
export async function registerPushToken(token: string, platform: string) {
  const res = await apiFetch("/api/push/register", {
    method: "POST",
    body: JSON.stringify({ token, platform }),
  });
  return res.ok;
}

// Restore session cookie from storage
export async function restoreSession() {
  try {
    const { storage } = await import("./storage");
    const cookie = await storage.getItem("safestop:session-cookie");
    if (cookie) {
      sessionCookie = cookie;
      // Verify session is still valid
      const family = await getFamily();
      return true;
    }
  } catch {}
  return false;
}
