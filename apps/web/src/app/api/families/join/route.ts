import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession, unauthorized, badRequest, notFound, serverError } from "@/lib/middleware";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const body = await req.json();
    const { inviteCode } = body;

    if (!inviteCode) return badRequest("inviteCode is required");

    const [family] = await db
      .select()
      .from(schema.families)
      .where(eq(schema.families.inviteCode, inviteCode.toUpperCase()));

    if (!family) return notFound("Invalid invite code");

    // Check if already a member
    const existing = await db
      .select()
      .from(schema.caregivers)
      .where(eq(schema.caregivers.userId, session.user.id));

    const alreadyMember = existing.find((c) => c.familyId === family.id);
    if (alreadyMember) {
      return badRequest("Already a member of this family");
    }

    const [caregiver] = await db
      .insert(schema.caregivers)
      .values({
        userId: session.user.id,
        familyId: family.id,
        role: "caregiver",
      })
      .returning();

    return NextResponse.json({ family, caregiver }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
