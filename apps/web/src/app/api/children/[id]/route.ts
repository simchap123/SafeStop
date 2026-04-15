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
    const [child] = await db
      .select()
      .from(schema.children)
      .where(eq(schema.children.id, id));

    if (!child) return notFound("Child not found");
    return NextResponse.json(child);
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
    const { name, age, photoUrl, notes } = body;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (age !== undefined) updateData.age = age;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (notes !== undefined) updateData.notes = notes;

    const [updated] = await db
      .update(schema.children)
      .set(updateData)
      .where(eq(schema.children.id, id))
      .returning();

    if (!updated) return notFound("Child not found");
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
    const [deleted] = await db
      .delete(schema.children)
      .where(eq(schema.children.id, id))
      .returning();

    if (!deleted) return notFound("Child not found");
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
