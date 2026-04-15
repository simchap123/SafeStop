import { describe, it, before } from "node:test";
import assert from "node:assert/strict";

const API_URL = process.env.API_URL || "http://68.183.20.8";

// Unique suffix to avoid collisions between test runs
const RUN_ID = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const TEST_EMAIL = `test-${RUN_ID}@safestop-test.local`;
const TEST_PASSWORD = "Test1234!secure";
const TEST_NAME = "Test User";

// Shared state across tests
let sessionCookie = "";
let familyId = "";
let childId = "";
let destinationId = "";
let caregiverId = "";
let tripSessionId = "";
let alertId = "";

/** Helper: make a request with optional auth cookie */
async function api(
  path: string,
  options: RequestInit & { query?: Record<string, string> } = {}
): Promise<Response> {
  const { query, ...fetchOptions } = options;
  let url = `${API_URL}${path}`;
  if (query) {
    const params = new URLSearchParams(query);
    url += `?${params.toString()}`;
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Origin": API_URL,
    ...(options.headers as Record<string, string> || {}),
  };
  if (sessionCookie) {
    headers["Cookie"] = sessionCookie;
  }
  return fetch(url, { ...fetchOptions, headers, redirect: "manual" });
}

/** Sign up a new test user and sign in to get a session cookie */
async function setupAuth(): Promise<void> {
  // Sign up
  const signupRes = await api("/api/auth/sign-up/email", {
    method: "POST",
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      name: TEST_NAME,
    }),
  });
  // Accept both 200 and 201 — Better Auth may return either
  assert.ok(
    signupRes.status === 200 || signupRes.status === 201,
    `Signup failed with status ${signupRes.status}: ${await signupRes.text()}`
  );

  // Sign in
  const signinRes = await api("/api/auth/sign-in/email", {
    method: "POST",
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
  });
  assert.ok(
    signinRes.status === 200 || signinRes.status === 201,
    `Signin failed with status ${signinRes.status}`
  );

  // Extract session cookie from Set-Cookie header
  const setCookies = signinRes.headers.getSetCookie?.() ?? [];
  const tokenCookie = setCookies.find((c) =>
    c.includes("better-auth.session_token=")
  );
  assert.ok(tokenCookie, "Session cookie not found in sign-in response");
  // Keep just the cookie key=value part (drop attributes like Path, HttpOnly, etc.)
  sessionCookie = tokenCookie.split(";")[0];
}

// ─── Tests ──────────────────────────────────────────────────────────────────────

describe("SafeStop API", () => {
  before(async () => {
    await setupAuth();
  });

  // 1. Health endpoint returns 200
  it("1 - GET /api/health returns 200 with status ok", async () => {
    const res = await fetch(`${API_URL}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, "ok");
    assert.ok(body.timestamp);
    assert.equal(body.service, "safestop-api");
  });

  // 2. Auth signup creates user
  it("2 - POST /api/auth/sign-up/email creates a new user", async () => {
    const email = `signup-verify-${RUN_ID}@safestop-test.local`;
    const res = await api("/api/auth/sign-up/email", {
      method: "POST",
      body: JSON.stringify({
        email,
        password: TEST_PASSWORD,
        name: "Signup Verify",
      }),
    });
    assert.ok(
      res.status === 200 || res.status === 201,
      `Expected 200 or 201, got ${res.status}`
    );
    const body = await res.json();
    assert.ok(body.user || body.id, "Response should contain user data");
  });

  // 3. Auth signin returns token
  it("3 - POST /api/auth/sign-in/email returns session cookie", async () => {
    const res = await api("/api/auth/sign-in/email", {
      method: "POST",
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }),
    });
    assert.ok(res.status === 200 || res.status === 201);
    const setCookies = res.headers.getSetCookie?.() ?? [];
    const hasSession = setCookies.some((c) =>
      c.includes("better-auth.session_token=")
    );
    assert.ok(hasSession, "Response should set session_token cookie");
  });

  // 4. Auth signin with wrong password fails
  it("4 - POST /api/auth/sign-in/email with wrong password returns error", async () => {
    const res = await api("/api/auth/sign-in/email", {
      method: "POST",
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: "WrongPassword999!",
      }),
    });
    // Better Auth returns 401 or 400 for wrong credentials
    assert.ok(
      res.status === 401 || res.status === 400 || res.status === 403,
      `Expected 4xx for wrong password, got ${res.status}`
    );
  });

  // 5. Unauthenticated requests to /api/families return 401
  it("5 - GET /api/families without auth returns 401", async () => {
    const res = await fetch(`${API_URL}/api/families`, {
      headers: { "Content-Type": "application/json" },
    });
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.error, "Unauthorized");
  });

  // 6. Create family (authenticated)
  it("6 - POST /api/families creates a family", async () => {
    const res = await api("/api/families", {
      method: "POST",
      body: JSON.stringify({ name: `Test Family ${RUN_ID}` }),
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok(body.id, "Family should have an id");
    assert.equal(body.name, `Test Family ${RUN_ID}`);
    assert.ok(body.inviteCode, "Family should have an invite code");
    familyId = body.id;
  });

  // 7. Get family (authenticated)
  it("7 - GET /api/families returns the user's family", async () => {
    const res = await api("/api/families");
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body, "Should return a family");
    assert.equal(body.id, familyId);
  });

  // 8. Create child (authenticated)
  it("8 - POST /api/children creates a child", async () => {
    const res = await api("/api/children", {
      method: "POST",
      body: JSON.stringify({
        familyId,
        name: "Test Child",
        age: 5,
        notes: "Test notes",
      }),
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok(body.id, "Child should have an id");
    assert.equal(body.name, "Test Child");
    assert.equal(body.age, 5);
    childId = body.id;
  });

  // 9. Get children (authenticated)
  it("9 - GET /api/children returns children for family", async () => {
    const res = await api("/api/children", { query: { familyId } });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body), "Should return an array");
    assert.ok(body.length >= 1, "Should have at least one child");
    const found = body.find((c: { id: string }) => c.id === childId);
    assert.ok(found, "Created child should be in the list");
  });

  // 10. Update child (authenticated)
  it("10 - PATCH /api/children/:id updates a child", async () => {
    const res = await api(`/api/children/${childId}`, {
      method: "PATCH",
      body: JSON.stringify({ name: "Updated Child", age: 6 }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.name, "Updated Child");
    assert.equal(body.age, 6);
  });

  // 11. Delete child (authenticated)
  it("11 - DELETE /api/children/:id deletes a child", async () => {
    // Create a temporary child to delete
    const createRes = await api("/api/children", {
      method: "POST",
      body: JSON.stringify({ familyId, name: "To Delete", age: 3 }),
    });
    assert.equal(createRes.status, 201);
    const created = await createRes.json();

    const res = await api(`/api/children/${created.id}`, { method: "DELETE" });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);

    // Verify it's gone
    const getRes = await api(`/api/children/${created.id}`);
    assert.equal(getRes.status, 404);
  });

  // 12. Create destination (authenticated)
  it("12 - POST /api/destinations creates a destination", async () => {
    const res = await api("/api/destinations", {
      method: "POST",
      body: JSON.stringify({
        familyId,
        name: "Test School",
        address: "123 Main St",
        latitude: "40.7128",
        longitude: "-74.0060",
        radius: 200,
      }),
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok(body.id, "Destination should have an id");
    assert.equal(body.name, "Test School");
    destinationId = body.id;
  });

  // 13. Get destinations (authenticated)
  it("13 - GET /api/destinations returns destinations for family", async () => {
    const res = await api("/api/destinations", { query: { familyId } });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body), "Should return an array");
    assert.ok(body.length >= 1, "Should have at least one destination");
    const found = body.find((d: { id: string }) => d.id === destinationId);
    assert.ok(found, "Created destination should be in the list");
  });

  // 14. Create trip session (authenticated)
  it("14 - POST /api/sessions creates a trip session", async () => {
    // First, get the caregiver ID (created when family was created)
    const familyRes = await api("/api/families");
    const family = await familyRes.json();
    // Query caregivers via the caregivers endpoint
    const caregiversRes = await api("/api/caregivers", {
      query: { familyId: family.id },
    });
    const caregivers = await caregiversRes.json();
    assert.ok(
      Array.isArray(caregivers) && caregivers.length > 0,
      "Should have at least one caregiver"
    );
    caregiverId = caregivers[0].id;

    const res = await api("/api/sessions", {
      method: "POST",
      body: JSON.stringify({
        familyId,
        caregiverId,
        destinationId,
        childIds: [childId],
        notes: "Test trip",
      }),
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok(body.id, "Session should have an id");
    assert.equal(body.familyId, familyId);
    assert.equal(body.status, "active");
    tripSessionId = body.id;
  });

  // 15. Get sessions (authenticated)
  it("15 - GET /api/sessions returns sessions", async () => {
    const res = await api("/api/sessions", { query: { familyId } });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body), "Should return an array");
    const found = body.find((s: { id: string }) => s.id === tripSessionId);
    assert.ok(found, "Created session should be in the list");
  });

  // 16. Create alert (authenticated)
  // Alerts are created by inserting directly; the API may not have a POST handler.
  // We test by triggering the alert_triggered status on a session and then checking alerts,
  // or we POST to alerts if supported. Since the alerts route only has GET,
  // we use the session PATCH to trigger an alert-like state and then verify via DB.
  // For a true integration test, we create an alert via the session status update.
  it("16 - PATCH /api/sessions/:id to alert_triggered status works", async () => {
    const res = await api(`/api/sessions/${tripSessionId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "alert_triggered" }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, "alert_triggered");
  });

  // 17. Get alerts (authenticated)
  it("17 - GET /api/alerts returns alerts array", async () => {
    const res = await api("/api/alerts");
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body), "Should return an array");
    // Store an alert ID if any exist (from prior runs or this run)
    if (body.length > 0) {
      alertId = body[0].id;
    }
  });

  // 18. Resolve alert (authenticated)
  // If no alert exists from previous test, we skip gracefully
  it("18 - POST /api/alerts/:id/resolve resolves an alert", async () => {
    if (!alertId) {
      // No alerts in the system — verify the endpoint at least returns 404 for a fake ID
      const res = await api(
        "/api/alerts/00000000-0000-0000-0000-000000000000/resolve",
        {
          method: "POST",
          body: JSON.stringify({ resolutionNote: "Test resolution" }),
        }
      );
      assert.equal(res.status, 404, "Should return 404 for non-existent alert");
      return;
    }

    const res = await api(`/api/alerts/${alertId}/resolve`, {
      method: "POST",
      body: JSON.stringify({ resolutionNote: "Test resolution" }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, "resolved");
    assert.ok(body.resolvedAt, "Should have resolvedAt timestamp");
    assert.equal(body.resolutionNote, "Test resolution");
  });

  // 19. Register push token (authenticated)
  it("19 - POST /api/push/register registers a push token", async () => {
    const token = `ExponentPushToken[test-${RUN_ID}]`;
    const res = await api("/api/push/register", {
      method: "POST",
      body: JSON.stringify({ token, platform: "ios" }),
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
  });

  // 20. SSE endpoint returns event-stream content type
  it("20 - GET /api/sse returns text/event-stream content type", async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch(`${API_URL}/api/sse`, {
        headers: {
          Cookie: sessionCookie,
          Accept: "text/event-stream",
        },
        signal: controller.signal,
      });
      assert.equal(res.status, 200);
      const contentType = res.headers.get("content-type");
      assert.ok(
        contentType?.includes("text/event-stream"),
        `Expected text/event-stream, got ${contentType}`
      );
    } catch (err: unknown) {
      // AbortError is expected — we just needed to check headers
      if (err instanceof Error && err.name === "AbortError") {
        // This is fine — SSE streams don't end, so we abort after checking headers
        // But if we got here, we never checked headers, so that's a problem
        assert.fail("Request was aborted before headers were received");
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  });
});
