import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession, unauthorized, badRequest, serverError } from "@/lib/middleware";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const body = await req.json();
    const { token, platform } = body;

    if (!token || !platform) {
      return badRequest("token and platform are required");
    }

    if (!["ios", "android", "web"].includes(platform)) {
      return badRequest("platform must be ios, android, or web");
    }

    // Upsert push token
    const existing = await db
      .select()
      .from(schema.pushTokens)
      .where(eq(schema.pushTokens.token, token));

    if (existing.length > 0) {
      await db
        .update(schema.pushTokens)
        .set({ userId: session.user.id, platform, updatedAt: new Date() })
        .where(eq(schema.pushTokens.token, token));
    } else {
      await db.insert(schema.pushTokens).values({
        userId: session.user.id,
        token,
        platform,
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
