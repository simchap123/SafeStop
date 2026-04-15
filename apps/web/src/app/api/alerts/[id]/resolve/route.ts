import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession, unauthorized, notFound, serverError } from "@/lib/middleware";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const { id } = await params;
    const body = await req.json();
    const { resolutionNote } = body;

    const [resolved] = await db
      .update(schema.alerts)
      .set({
        status: "resolved",
        resolvedAt: new Date(),
        resolvedBy: session.user.id,
        resolutionNote: resolutionNote || null,
        updatedAt: new Date(),
      })
      .where(eq(schema.alerts.id, id))
      .returning();

    if (!resolved) return notFound("Alert not found");
    return NextResponse.json(resolved);
  } catch (error) {
    return serverError(error);
  }
}
