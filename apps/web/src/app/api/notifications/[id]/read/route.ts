import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { getSession, unauthorized, notFound, serverError } from "@/lib/middleware";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const { id } = await params;

    const [updated] = await db
      .update(schema.notifications)
      .set({ read: true })
      .where(
        and(
          eq(schema.notifications.id, id),
          eq(schema.notifications.userId, session.user.id)
        )
      )
      .returning();

    if (!updated) return notFound("Notification not found");
    return NextResponse.json(updated);
  } catch (error) {
    return serverError(error);
  }
}
