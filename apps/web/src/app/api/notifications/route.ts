import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { getSession, unauthorized, serverError } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const results = await db
      .select()
      .from(schema.notifications)
      .where(eq(schema.notifications.userId, session.user.id))
      .orderBy(desc(schema.notifications.createdAt));

    return NextResponse.json(results);
  } catch (error) {
    return serverError(error);
  }
}
