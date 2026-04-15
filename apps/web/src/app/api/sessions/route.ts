import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession, unauthorized, badRequest, serverError } from "@/lib/middleware";
import { sseManager } from "@/lib/sse";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const { searchParams } = new URL(req.url);
    const familyId = searchParams.get("familyId");
    const status = searchParams.get("status");

    let results;
    if (familyId) {
      results = await db
        .select()
        .from(schema.tripSessions)
        .where(eq(schema.tripSessions.familyId, familyId));
    } else {
      results = await db.select().from(schema.tripSessions);
    }

    return NextResponse.json(results);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const body = await req.json();
    const { familyId, caregiverId, destinationId, childIds, notes } = body;

    if (!familyId || !caregiverId) {
      return badRequest("familyId and caregiverId are required");
    }

    const [tripSession] = await db
      .insert(schema.tripSessions)
      .values({
        familyId,
        caregiverId,
        destinationId: destinationId || null,
        notes: notes || null,
      })
      .returning();

    if (childIds && Array.isArray(childIds)) {
      for (const childId of childIds) {
        await db.insert(schema.sessionChildren).values({
          sessionId: tripSession.id,
          childId,
        });
      }
    }

    sseManager.sendToUser(session.user.id, "session_started", {
      sessionId: tripSession.id,
    });

    return NextResponse.json(tripSession, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
