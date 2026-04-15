import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { getSession, unauthorized, serverError } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    let results;
    if (sessionId) {
      results = await db
        .select()
        .from(schema.alerts)
        .where(eq(schema.alerts.sessionId, sessionId))
        .orderBy(desc(schema.alerts.createdAt));
    } else {
      results = await db
        .select()
        .from(schema.alerts)
        .orderBy(desc(schema.alerts.createdAt));
    }

    return NextResponse.json(results);
  } catch (error) {
    return serverError(error);
  }
}
