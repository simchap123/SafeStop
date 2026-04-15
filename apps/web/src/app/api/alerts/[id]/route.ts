import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession, unauthorized, notFound, serverError } from "@/lib/middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const { id } = await params;
    const [alert] = await db
      .select()
      .from(schema.alerts)
      .where(eq(schema.alerts.id, id));

    if (!alert) return notFound("Alert not found");
    return NextResponse.json(alert);
  } catch (error) {
    return serverError(error);
  }
}
