import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession, unauthorized, badRequest, serverError } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const { searchParams } = new URL(req.url);
    const familyId = searchParams.get("familyId");

    if (!familyId) return badRequest("familyId is required");

    const results = await db
      .select()
      .from(schema.destinations)
      .where(eq(schema.destinations.familyId, familyId));

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
    const { familyId, name, address, latitude, longitude, radius } = body;

    if (!familyId || !name) {
      return badRequest("familyId and name are required");
    }

    const [destination] = await db
      .insert(schema.destinations)
      .values({ familyId, name, address, latitude, longitude, radius })
      .returning();

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
