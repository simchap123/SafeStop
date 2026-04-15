import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession, unauthorized, badRequest, serverError } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const userCaregivers = await db
      .select()
      .from(schema.caregivers)
      .where(eq(schema.caregivers.userId, session.user.id));

    if (userCaregivers.length === 0) {
      return NextResponse.json(null);
    }

    const familyId = userCaregivers[0].familyId;
    const [family] = await db
      .select()
      .from(schema.families)
      .where(eq(schema.families.id, familyId));

    return NextResponse.json(family || null);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const body = await req.json();
    const { name } = body;

    if (!name) return badRequest("name is required");

    const inviteCode = crypto.randomUUID().slice(0, 8).toUpperCase();

    const [family] = await db
      .insert(schema.families)
      .values({
        name,
        inviteCode,
        createdBy: session.user.id,
      })
      .returning();

    // Add creator as parent caregiver
    await db.insert(schema.caregivers).values({
      userId: session.user.id,
      familyId: family.id,
      role: "parent",
    });

    return NextResponse.json(family, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
