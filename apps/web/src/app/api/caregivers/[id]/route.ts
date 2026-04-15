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
    const [caregiver] = await db
      .select()
      .from(schema.caregivers)
      .where(eq(schema.caregivers.id, id));

    if (!caregiver) return notFound("Caregiver not found");
    return NextResponse.json(caregiver);
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
    const { role, isActive } = body;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const [updated] = await db
      .update(schema.caregivers)
      .set(updateData)
      .where(eq(schema.caregivers.id, id))
      .returning();

    if (!updated) return notFound("Caregiver not found");
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
    const [removed] = await db
      .update(schema.caregivers)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.caregivers.id, id))
      .returning();

    if (!removed) return notFound("Caregiver not found");
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
