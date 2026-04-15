import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { Pool } from "pg";

// Direct DB lookup for Bearer token auth (cross-origin)
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

async function getSessionByToken(token: string) {
  try {
    const result = await pool.query(
      `SELECT s.*, u.id as "userId", u.name, u.email, u.image, u."emailVerified"
       FROM "session" s JOIN "user" u ON s."userId" = u.id
       WHERE s.token = $1 AND s."expiresAt" > NOW()`,
      [token]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      session: { id: row.id, token: row.token, userId: row.userId, expiresAt: row.expiresAt },
      user: { id: row.userId, name: row.name, email: row.email, image: row.image, emailVerified: row.emailVerified },
    };
  } catch {
    return null;
  }
}

export async function getSession(req: NextRequest) {
  // Check for Bearer token first (cross-origin mobile/web clients)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    return getSessionByToken(token);
  }

  // Fall back to cookie-based auth
  const session = await auth.api.getSession({ headers: req.headers });
  return session;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(error: unknown) {
  console.error(error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
