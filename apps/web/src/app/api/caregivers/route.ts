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
      .from(schema.caregivers)
      .where(eq(schema.caregivers.familyId, familyId));

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
    const { userId, familyId, role } = body;

    if (!userId || !familyId) {
      return badRequest("userId and familyId are required");
    }

    const [caregiver] = await db
      .insert(schema.caregivers)
      .values({ userId, familyId, role: role || "caregiver" })
      .returning();

    return NextResponse.json(caregiver, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
