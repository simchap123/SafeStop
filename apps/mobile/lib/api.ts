import { getItem, setItem, removeItem } from "./storage";

const API_URL = "https://test.shulgenius.com";
const TOKEN_KEY = "safestop:auth-token";

// Bearer token storage
let authToken = "";

export function getAuthToken() {
  return authToken;
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  // Try to capture session token from Set-Cookie header (works on same-origin / native)
  try {
    const setCookie = res.headers.get("set-cookie") || "";
    const match = setCookie.match(/(?:__Secure-)?better-auth\.session_token=([^;]+)/);
    if (match) {
      authToken = match[1];
      await setItem(TOKEN_KEY, match[1]).catch(() => {});
    }
  } catch {}
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
  const data = await res.json();
  // Store the session token
  if (data.token) {
    authToken = data.token;
    await setItem(TOKEN_KEY, data.token).catch(() => {});
  }
  return data;
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
  const data = await res.json();
  // Store the session token
  if (data.token) {
    authToken = data.token;
    await setItem(TOKEN_KEY, data.token).catch(() => {});
  }
  return data;
}

export async function signOut() {
  await apiFetch("/api/auth/sign-out", { method: "POST" }).catch(() => {});
  authToken = "";
  await removeItem(TOKEN_KEY).catch(() => {});
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create family" }));
    throw new Error(err.message || "Failed to create family");
  }
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

export async function updateFamily(id: string, data: { name?: string }) {
  const res = await apiFetch(`/api/families/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update family");
  return res.json();
}

export async function inviteToFamily(data: { email: string; role: string; familyId: string }) {
  const res = await apiFetch("/api/families/invite", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to send invite");
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

export async function updateDestination(id: string, data: { name?: string; address?: string; radius?: number; isDefault?: boolean }) {
  const res = await apiFetch(`/api/destinations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update destination");
  return res.json();
}

export async function deleteDestination(id: string) {
  const res = await apiFetch(`/api/destinations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete destination");
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

// Restore session from stored token
export async function restoreSession() {
  try {
    const token = await getItem(TOKEN_KEY);
    if (token) {
      authToken = token;
      // Verify session is still valid
      const family = await getFamily();
      return true;
    }
  } catch {
    authToken = "";
  }
  return false;
}
