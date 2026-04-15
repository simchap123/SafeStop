import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession, unauthorized, notFound, serverError } from "@/lib/middleware";
import { sseManager } from "@/lib/sse";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const { id } = await params;
    const [tripSession] = await db
      .select()
      .from(schema.tripSessions)
      .where(eq(schema.tripSessions.id, id));

    if (!tripSession) return notFound("Session not found");

    return NextResponse.json(tripSession);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const { id } = await params;
    const body = await req.json();
    const { status, confirmationPhotoUrl, notes } = body;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (confirmationPhotoUrl) updateData.confirmationPhotoUrl = confirmationPhotoUrl;
    if (notes !== undefined) updateData.notes = notes;

    if (status === "confirmed_safe") {
      updateData.confirmedAt = new Date();
      sseManager.sendToUser(session.user.id, "confirmation_received", { sessionId: id });
    }
    if (status === "awaiting_confirmation") {
      updateData.stopDetectedAt = new Date();
      sseManager.sendToUser(session.user.id, "stop_detected", { sessionId: id });
    }
    if (status === "ended") {
      updateData.endedAt = new Date();
      sseManager.sendToUser(session.user.id, "session_ended", { sessionId: id });
    }

    const [updated] = await db
      .update(schema.tripSessions)
      .set(updateData)
      .where(eq(schema.tripSessions.id, id))
      .returning();

    if (!updated) return notFound("Session not found");

    return NextResponse.json(updated);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const { id } = await params;

    const [ended] = await db
      .update(schema.tripSessions)
      .set({ status: "ended", endedAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.tripSessions.id, id))
      .returning();

    if (!ended) return notFound("Session not found");

    sseManager.sendToUser(session.user.id, "session_ended", { sessionId: id });

    return NextResponse.json(ended);
  } catch (error) {
    return serverError(error);
  }
}
