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
    const [destination] = await db
      .select()
      .from(schema.destinations)
      .where(eq(schema.destinations.id, id));

    if (!destination) return notFound("Destination not found");
    return NextResponse.json(destination);
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
    const { name, address, latitude, longitude, radius } = body;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (radius !== undefined) updateData.radius = radius;

    const [updated] = await db
      .update(schema.destinations)
      .set(updateData)
      .where(eq(schema.destinations.id, id))
      .returning();

    if (!updated) return notFound("Destination not found");
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
      .delete(schema.destinations)
      .where(eq(schema.destinations.id, id))
      .returning();

    if (!deleted) return notFound("Destination not found");
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
